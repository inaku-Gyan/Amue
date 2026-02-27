#!/usr/bin/env node
import { mkdtemp, rm, cp, mkdir, readFile, writeFile, access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { cac } from "cac";
import { execa } from "execa";

const cli = cac("amue");
const layerRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownRoutes(contentDir, currentDir = contentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const entryPath = join(currentDir, entry.name);

    if (entry.isDirectory()) {
      const nestedRoutes = await collectMarkdownRoutes(contentDir, entryPath);
      routes.push(...nestedRoutes);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const relativePath = entryPath.slice(contentDir.length + 1).replace(/\\/g, "/");
    const withoutExt = relativePath.replace(/\.md$/i, "");

    if (withoutExt === "index") {
      routes.push("/");
      continue;
    }

    if (withoutExt.endsWith("/index")) {
      routes.push(`/${withoutExt.slice(0, -"/index".length)}`);
      continue;
    }

    routes.push(`/${withoutExt}`);
  }

  return Array.from(new Set(routes)).sort();
}

async function createTempNuxtProject(inputDir, contentDir) {
  const tempDir = await mkdtemp(join(layerRoot, ".amue-build-"));
  const nuxtConfigPath = join(tempDir, "nuxt.config.ts");
  const prerenderRoutes = await collectMarkdownRoutes(contentDir);

  const generatedConfig = `
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: [${JSON.stringify(layerRoot)}],
  nitro: {
    prerender: {
      routes: ${JSON.stringify(prerenderRoutes)}
    }
  },
  content: {
    sources: {
      content: {
        driver: 'fs',
        base: 'content'
      }
    }
  }
})
`;

  await writeFile(nuxtConfigPath, generatedConfig.trimStart(), "utf8");

  const sourceAppConfig = join(inputDir, "app.config.ts");
  if (await exists(sourceAppConfig)) {
    await cp(sourceAppConfig, join(tempDir, "app.config.ts"));
  }

  await cp(contentDir, join(tempDir, "content"), { recursive: true });

  const sourceContentConfig = join(layerRoot, "content.config.ts");
  if (await exists(sourceContentConfig)) {
    await cp(sourceContentConfig, join(tempDir, "content.config.ts"));
  }

  return tempDir;
}

async function copyOutput(tempDir, outDir) {
  const generatedPublicDir = join(tempDir, ".output", "public");
  await mkdir(outDir, { recursive: true });
  await cp(generatedPublicDir, outDir, { recursive: true, force: true });

  const indexFile = join(outDir, "index.html");
  const fallback404 = join(outDir, "404.html");
  if (await exists(indexFile)) {
    const indexContent = await readFile(indexFile, "utf8");
    await writeFile(fallback404, indexContent, "utf8");
  }
}

cli
  .command("build [inputDir]", "Build static blog from a content directory")
  .option("--content <dir>", "Markdown directory relative to inputDir", "content")
  .option("--out <dir>", "Output directory", ".amue")
  .option("--base <baseURL>", "Base URL for GitHub Pages project pages", "/")
  .action(async (inputDir = ".", options) => {
    const resolvedInputDir = resolve(process.cwd(), inputDir);
    const contentDir = resolve(resolvedInputDir, options.content);
    const outDir = resolve(process.cwd(), options.out);
    const baseURL = options.base.endsWith("/") ? options.base : `${options.base}/`;

    if (!(await exists(contentDir))) {
      console.error(`[amue] Content directory not found: ${contentDir}`);
      process.exit(1);
    }

    const tempNuxtDir = await createTempNuxtProject(resolvedInputDir, contentDir);

    try {
      await execa("npx", ["nuxi", "generate"], {
        cwd: tempNuxtDir,
        env: {
          ...process.env,
          NUXT_APP_BASE_URL: baseURL,
          AMUE_BASE_URL: baseURL,
          AMUE_CONTENT_DIR: contentDir,
        },
        stdio: "inherit",
      });

      await copyOutput(tempNuxtDir, outDir);
      console.info(`[amue] Build complete: ${outDir}`);
      console.info(`[amue] Base URL: ${baseURL}`);
    } finally {
      await rm(tempNuxtDir, { recursive: true, force: true });
    }
  });

cli.help();
cli.parse();
