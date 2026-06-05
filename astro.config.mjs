import { defineConfig } from 'astro/config';

// Reine Statik — Cloudflare Pages liefert den gebauten /dist-Ordner direkt aus.
export default defineConfig({
  site: 'https://www.penicheonsurf.com',
  output: 'static',
});
