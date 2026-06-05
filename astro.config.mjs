import { defineConfig } from 'astro/config';

// Static output — Cloudflare Pages serves the built /dist folder directly.
export default defineConfig({
  site: 'https://penicheonsurf.com',
});
