# Peniche On Surf — Website + Sveltia CMS

Static **Astro** site for penicheonsurf.com with a built-in **Sveltia CMS** so Pedro can
edit all text (EN + PT), prices and gallery photos himself. Content lives in two JSON files;
saving in the CMS commits to GitHub and **Cloudflare Pages** rebuilds automatically.

```
src/
  data/en.json        ← English content  (edited via CMS)
  data/pt.json        ← Portuguese content (edited via CMS)
  pages/index.astro   ← the page; pulls text from the JSON via data-i18n keys
public/
  uploads/            ← gallery photos & media (CMS media library writes here)
  admin/index.html    ← the CMS UI  → lives at /admin
  admin/config.yml    ← content model (fields, backend, media)

```

## How the content wiring works

The page keeps its original markup. Every editable element carries a `data-i18n="key"`
attribute, and a tiny inline script swaps in the value for the chosen language at load,
exactly as the original site did — except the dictionary is no longer hard-coded: Astro
imports `en.json` / `pt.json` at build time and injects them.

**To make any further text/number editable** (e.g. the detailed rental-table figures):
1. add the key + value to `src/data/en.json` **and** `src/data/pt.json`
2. add a matching field to **both** file blocks in `public/admin/config.yml`
3. put `data-i18n="yourkey"` on the element in `index.astro`

That is the whole pattern; the four headline prices and the "Most popular" badge are
already wired this way as examples.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to ./dist
```

## Cloudflare Pages settings

Connect the GitHub repo in the Cloudflare Pages dashboard with:

- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Production branch:** `main`

Every push to `main` (including commits the CMS makes) triggers a rebuild.

## CMS authentication (GitHub OAuth via a Cloudflare Worker)

Because the site is on Cloudflare (not Netlify), there is no built-in identity service.
Sveltia provides a small Worker that handles the GitHub login. One-time setup:

1. **Deploy the auth Worker.** Follow the repo instructions for
   `sveltia/sveltia-cms-auth` (deploy to Cloudflare Workers). Note the Worker URL,
   e.g. `https://sveltia-cms-auth.<sub>.workers.dev`.
2. **Register a GitHub OAuth App** (GitHub → Settings → Developer settings → OAuth Apps):
   - Homepage URL: your site
   - Authorization callback URL: `https://<your-worker-url>/callback`
   - Copy the **Client ID** and generate a **Client Secret**.
3. **Add the credentials** to the Worker's environment variables (`GITHUB_CLIENT_ID`,
   `GITHUB_CLIENT_SECRET`) and redeploy.
4. **Point the CMS at the Worker.** In `public/admin/config.yml` set:
   ```yaml
   backend:
     name: github
     repo: OWNER/REPO          # your GitHub repo
     branch: main
     base_url: https://<your-worker-url>
   ```

After that, Pedro just opens **penicheonsurf.com/admin**, clicks **Login with GitHub**,
and edits. (For your own quick edits as a developer, Sveltia also supports signing in
with a GitHub personal access token instead of the Worker — handier for a solo dev, but
the OAuth Worker is the friendlier option for a non-technical editor.)

## Editor workflow (for Pedro)

1. Go to **/admin**, log in with GitHub.
2. Open **Website content → Website (English)** or **(Português)**.
3. Edit any field (text, prices, qualifications…). For photos, open the gallery image
   fields / media library and upload — files land in `public/uploads`.
4. **Save** → the change is committed and the live site rebuilds in ~1–2 minutes.

> Tip: edit the English and Portuguese entries together so both languages stay in sync.
