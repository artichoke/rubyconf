/* eslint-disable no-console */

import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import minifyHtml from "@minify-html/node";
import { renderFile } from "eta";
import esbuild from "esbuild";
import hljs from "highlight.js";
import { marked } from "marked";
import sass from "sass";

// eslint-disable-next-line no-shadow
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const assets = Object.freeze([
  "src/learnxinyminutes-truncated.txt",
  "node_modules/@artichokeruby/logo/img/artichoke-logo.png",
  "node_modules/@artichokeruby/logo/img/artichoke-logo.svg",
  "node_modules/@artichokeruby/logo/img/artichoke-logo-inverted.png",
  "node_modules/@artichokeruby/logo/img/artichoke-logo-inverted.svg",
  "node_modules/@artichokeruby/logo/img/playground.png",
  "node_modules/@artichokeruby/logo/img/playground-social-logo.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-32x32.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-128x128.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-192x192.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-196x196.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-152x152.png",
  "node_modules/@artichokeruby/logo/favicons/favicon-180x180.png",
  "node_modules/@artichokeruby/logo/favicons/safari-pinned-tab.svg",
  "node_modules/@artichokeruby/logo/favicons/mstile-150x150.png",
  "node_modules/@artichokeruby/logo/favicons/browserconfig.xml",
  "node_modules/@artichokeruby/logo/favicons/site.webmanifest",
  "node_modules/@artichokeruby/logo/optimized/nav-white.svg",
  "node_modules/@artichokeruby/logo/optimized/wordmark-black.svg",
  "node_modules/@artichokeruby/logo/social/twitter-logo-black.svg",
  "node_modules/@artichokeruby/logo/social/twitter-logo-blue.svg",
  "node_modules/@artichokeruby/logo/social/github-logo.svg",
  "node_modules/@artichokeruby/logo/social/discord-logo.svg",
]);

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, language) => {
    const highlighted = hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    });
    const html = highlighted.value;
    return html;
  },
  langPrefix: "hljs artichoke-highlight language-",
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

const includeMarkdown = (source) => {
  const filePath = path.join(__dirname, "src", source);
  const content = readFileSync(filePath);
  return marked(content.toString());
};

const esbuildSassPlugin = {
  name: "sass",
  setup(build) {
    build.onResolve({ filter: /\.scss$/ }, (args) => {
      return {
        path: path.resolve(args.resolveDir, args.path),
        namespace: "sass",
      };
    });
    build.onLoad({ filter: /.*/, namespace: "sass" }, (args) => {
      let compiled = sass.renderSync({
        file: args.path,
        includePaths: [path.join(__dirname, "node_modules")],
      });
      return {
        contents: compiled.css.toString(),
        loader: "css",
      };
    });
  },
};

const build = async () => {
  await fs.mkdir("dist/2019", { recursive: true });
  await fs.mkdir("dist/social", { recursive: true });

  await Promise.all(
    assets.map(async (asset) => {
      const file = path.basename(asset);
      if (asset.includes("/social/")) {
        await fs.copyFile(asset, path.join(__dirname, "dist", "social", file));
      } else if (asset.includes("/logos/")) {
        await fs.copyFile(asset, path.join(__dirname, "dist", "logos", file));
      } else {
        await fs.copyFile(asset, path.join(__dirname, "dist", file));
      }
    })
  );

  let index = await renderFile(
    "index.html",
    { includeMarkdown },
    { views: path.join(__dirname, "src") }
  );

  if (process.argv.includes("--release")) {
    const input = Buffer.from(index);
    const output = minifyHtml.minify(input, {
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_html_and_head_opening_tags: true,
      keep_closing_tags: true,
      minify_js: true,
      minify_css: true,
      remove_bangs: false,
    });

    index = output.toString();
  }

  await fs.writeFile(path.join(__dirname, "dist", "index.html"), index);

  let deck2019 = await renderFile(
    "2019/index.html",
    { includeMarkdown },
    { views: path.join(__dirname, "src") }
  );

  if (process.argv.includes("--release")) {
    const input = Buffer.from(deck2019);
    const output = minifyHtml.minify(input, {
      ensure_spec_compliant_unquoted_attribute_values: true,
      keep_html_and_head_opening_tags: true,
      keep_closing_tags: true,
      minify_js: true,
      minify_css: true,
      remove_bangs: false,
    });

    deck2019 = output.toString();
  }

  await fs.writeFile(
    path.join(__dirname, "dist", "2019", "index.html"),
    deck2019
  );

  await esbuild.build({
    entryPoints: {
      landing: "./src/landing.js",
      deck2019: "./src/2019/deck.js",
    },
    entryNames: "[name].bundle",
    bundle: true,
    outdir: "./dist",
    loader: {
      ".eot": "file",
      ".ttf": "file",
      ".woff": "file",
    },
    minify: process.argv.includes("--release"),
    plugins: [esbuildSassPlugin],
  });
};

(async function main() {
  try {
    await build();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();