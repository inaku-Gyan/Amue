/**
 * Deploy the generated static files to GitHub Pages.
 *
 * This script assumes that the static files have already been generated using `nuxt generate` and that a `.nojekyll` file has been created in the output directory to prevent GitHub Pages from ignoring files and directories that start with an underscore (_).
 */

import ghpages from "gh-pages";

ghpages.publish(".output/public", {
  nojekyll: true,
  branch: "main",
  repo: "git@github.com:inaku-Gyan/inaku-Gyan.github.io.git",
  user: { name: "Deploy Bot" },
});
