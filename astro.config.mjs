import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// Reine Statik — Cloudflare Pages liefert den gebauten /dist-Ordner direkt aus.
export default defineConfig({
  site: 'https://www.penicheonsurf.com',
  output: "hybrid",
  adapter: cloudflare()
});