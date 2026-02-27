# Amue Framework (Nuxt Layer + CLI)

基于 Nuxt 4 + Vue 3 的博客框架核心仓库，定位为可复用的 Nuxt Layer（Theme）并提供 CLI 构建入口。

## 目录结构（MVP）

```txt
.
├─ app/
│  ├─ app.vue
│  ├─ layouts/
│  │  └─ default.vue
│  └─ pages/
│     └─ [...slug].vue
├─ bin/
│  └─ amue.mjs
├─ public/
│  └─ robots.txt
├─ .oxfmt.json
├─ .oxlintrc.json
├─ nuxt.config.ts
├─ package.json
├─ tsconfig.json
└─ uno.config.ts
```

## 核心设计

- 本仓库即 Layer：由外部 Nuxt 工程通过 `extends` 复用。
- CLI 使用临时 Nuxt 项目，动态注入：
  - 内容目录（`@nuxt/content` 文件源）
  - `baseURL`（适配 GitHub Pages 子路径）
- 通过 `nuxi generate` 生成静态站点，并复制 `index.html` 为 `404.html` 解决 Pages 刷新路径问题。

## 本地开发

```bash
pnpm install
pnpm dev
```

## CLI 用法

```bash
# 在当前仓库内调试 CLI
node ./bin/amue.mjs build ./example-content --content content --out .amue --base /my-blog/

# 作为 npm 包安装后
amue build /path/to/blog-content --content content --out .amue --base /repo-name/
```

参数说明：

- `build [inputDir]`：内容工程根目录（默认当前目录）
- `--content`：Markdown 目录（相对 inputDir，默认 `content`）
- `--out`：构建产物输出目录（默认 `.amue`）
- `--base`：站点 `baseURL`（默认 `/`）

## 内容目录约定（示例）

```txt
my-blog-content/
├─ content/
│  ├─ index.md
│  └─ posts/
│     └─ hello.md
└─ app.config.ts (可选)
```

`index.md` 对应 `/`，`posts/hello.md` 对应 `/posts/hello`。

## 工程化

- Lint：`pnpm lint`（`oxlint`）
- Format：`pnpm format:write`（`oxfmt`）
- Git Hooks：`simple-git-hooks` + `lint-staged`，在 `pre-commit` 自动执行检查
