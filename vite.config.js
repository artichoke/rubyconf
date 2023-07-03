import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "vite";

import minifyHtml from "@minify-html/node";
import { Eta } from "eta";
import hljs from "highlight.js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";

marked.use({
  headerIds: false,
  mangle: false,
});

marked.use(
  markedHighlight({
    langPrefix: "hljs artichoke-highlight language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      const highlighted = hljs.highlight(code, {
        language,
        ignoreIllegals: true,
      });
      const html = highlighted.value;
      return html;
    },
  })
);

const includeMarkdown = (source) => {
  const filePath = path.resolve(__dirname, "src", source);
  const content = readFileSync(filePath);
  return marked.parse(content.toString());
};

const etaPlugin = () => {
  return {
    name: "eta-html-transform",
    transformIndexHtml: {
      enforce: "pre",
      transform(html) {
        const eta = new Eta({ views: "src" });
        return eta.renderString(html, { includeMarkdown });
      },
    },
  };
};

const minifyHtmlPlugin = () => {
  return {
    name: "minify-html-transform",
    apply: "build",
    transformIndexHtml: {
      enforce: "post",
      transform(html) {
        const input = Buffer.from(html);

        const output = minifyHtml.minify(input, {
          ensure_spec_compliant_unquoted_attribute_values: true,
          keep_html_and_head_opening_tags: true,
          keep_closing_tags: true,
          minify_js: true,
          minify_css: true,
          remove_bangs: false,
        });

        return output.toString();
      },
    },
  };
};

export default defineConfig({
  root: path.resolve(__dirname, "src"),
  base: "/rubyconf/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src", "index.html"),
        2019: path.resolve(__dirname, "src", "2019", "index.html"),
      },
    },
  },
  plugins: [etaPlugin(), minifyHtmlPlugin()],
  server: {
    port: 4923,
    hot: true,
  },
});
