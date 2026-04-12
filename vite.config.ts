import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { getSitemapStaticPaths } from "./src/lib/sitemapPaths";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function seoArtifactsPlugin(siteUrl: string): Plugin {
  return {
    name: "seo-artifacts",
    closeBundle() {
      const outDir = path.resolve(dirname, "dist");
      fs.mkdirSync(outDir, { recursive: true });

      const base = siteUrl.trim().replace(/\/$/, "");
      const robotsLines = ["User-agent: *", "Allow: /", ""];

      if (base && /^https?:\/\//i.test(base)) {
        robotsLines.push(`Sitemap: ${base}/sitemap.xml`, "");
        const paths = getSitemapStaticPaths();
        const lastmod = new Date().toISOString().slice(0, 10);
        const body = paths
          .map((p) => {
            const loc = `${base}${p}`;
            const pri =
              p === "/"
                ? "1.0"
                : p === "/learn"
                  ? "0.95"
                  : p === "/blog"
                    ? "0.85"
                    : p.startsWith("/learn/")
                      ? "0.75"
                      : "0.7";
            return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${pri}</priority></url>`;
          })
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
        fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf8");
      }

      fs.writeFileSync(path.join(outDir, "robots.txt"), robotsLines.join("\n"), "utf8");
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, dirname, "");
  const siteUrl = env.VITE_SITE_URL ?? "";

  return {
    plugins: [react(), seoArtifactsPlugin(siteUrl)],
    resolve: {
      alias: {
        "@": path.resolve(dirname, "./src"),
      },
    },
  };
});
