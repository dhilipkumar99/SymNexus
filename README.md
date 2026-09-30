# Symnexus — company website

Marketing site for [symnexus.co](https://symnexus.co). Plain **PHP 8** templates, **Tailwind CSS 3**,
and a small vanilla-JS **SPA router** — no framework, no database. The design system (floating glass
pill header, light/dark themes, Montserrat · Karla · Open Sans, teal `#009688`) is ported from
[hemkhatri/Dynamic-Portfolio-Website](https://github.com/hemkhatri/Dynamic-Portfolio-Website).

## Run locally

```bash
npm install
npm run build        # compile Tailwind → public/assets/css/app.css (npm run watch while editing)
npm run dev          # php -S localhost:8000 -t public api/index.php  (needs PHP ≥ 8.1)
```

No local PHP? Use `npm run dev:docker` (Docker Desktop must be running), or install PHP with `brew install php`.

## Layout

```text
api/index.php           Entrypoint for every dynamic request (Vercel function + local dev router)
src/app.php             Router: route table, redirects, sitemap, error handling
src/bootstrap.php       Constants (email, phone, URL), helpers (e(), asset(), partial()…), .env loader
src/pages/*.php         One template per page — sets $pageTitle / $pageMeta, includes header + footer
src/includes/           header.php (SEO meta, JSON-LD, nav) · footer.php · icons.php
src/partials/           Reusable blocks: page header, CTA, carousel, forms, product mock-ups, chat widget
src/data/               Products, navigation and image catalogues
src/backend/chat.php    POST /api/chat — AI assistant proxy
src/ai/instructions.md  System prompt (company facts) for the assistant
src/css/app.css         Tailwind entry + component classes
public/                 Static files served at the site root (assets, favicon, sw.js, robots.txt, video)
```

**Adding a page:** create `src/pages/<name>.php` (copy an existing one), add it to `ROUTES` in
`src/app.php` (it then appears in `/sitemap.xml`), and to `src/data/nav.php` if it belongs in the nav.
Run `npm run build` if you used new Tailwind classes.

## How navigation works

Internal links are intercepted by `public/assets/js/spa-router.js`, which fetches the page with
`X-SPA-Request: true`. `header.php`/`footer.php` then return only the inner fragment (with
`X-SPA-Fragment` and `X-SPA-Title` headers) and the router swaps it into `#spa-container`. Anything
unexpected — errors, non-page links, pages like `/video` that render their own document — falls back
to a normal page load, so the site works fully without JavaScript.

## Forms

The contact and demo forms post to `/api/contact` (`src/backend/contact.php`), which validates the
submission and emails it to **info@symnexus.co** through [Resend](https://resend.com), with the
visitor's address as Reply-To. Spam protection: same-origin check, hidden honeypot field and a
per-IP rate limit (5 per 10 minutes). Without JavaScript the forms still work as a normal post.

| Variable | Required | Default |
| --- | :---: | --- |
| `RESEND_API_KEY` | yes | — (added by the Vercel Marketplace Resend integration) |
| `CONTACT_TO_EMAIL` | no | `info@symnexus.co` (`SITE_EMAIL` in `src/bootstrap.php`) |
| `CONTACT_FROM_EMAIL` | no | `Symnexus Website <website@symnexus.co>` — its domain must be verified in Resend |

If the key is missing or Resend rejects a message, visitors see an error with the email address
to write to instead, and the detail is written to the Vercel function logs.

## Solutions page (SymNexus product sites)

`/solutions` lists the nine SymNexus(x) products and their tasks. Each task button links to that
task's page on the product's own site (`<base>/tasks/<slug>`), which opens the project questionnaire.
The product sites live in the separate ModelsCore repo; they are plain Node apps, not part of this
deployment.

- **Data is generated.** `src/data/modelscore.php` and `public/assets/images/tasks/*.png` are copied
  from ModelsCore. After any task change there, run `npm run sync:modelscore` (set `MODELSCORE_DIR`
  if ModelsCore isn't next to this repo), then `npm run build`, and commit both. Never hand-edit them.
- **Links.** Set `SYMNEXUS_PREDICT_URL` … `SYMNEXUS_VOICE_URL` (see `.env.example`) to the deployed
  product sites. Unset, links fall back to `http://localhost:3101…3109`, which only works for local
  demos. The page is kept out of `/sitemap.xml` until then (`priority => null` in `src/app.php`).

## AI assistant (optional)

The chat widget appears only when an API key is configured. Set these in Vercel → Project → Settings →
Environment Variables (or in a local `.env`, see `.env.example`):

| Variable | Required | Default |
| --- | :---: | --- |
| `AI_API_KEY` (or `GROQ_API_KEY`) | yes | — |
| `AI_API_URL` | no | `https://api.groq.com/openai/v1/chat/completions` |
| `AI_MODEL` | no | `llama-3.3-70b-versatile` |

Any OpenAI-compatible chat-completions endpoint works. Edit what the assistant knows in
`src/ai/instructions.md`.

`/api/chat` only accepts same-origin browser requests and applies a per-IP and per-instance rate limit
(20 requests / 5 min per IP). Serverless instances don't share memory, so for production also add a
Vercel Firewall rate-limit rule on `/api/chat` and set a spend cap with your AI provider.

## Deploying

**Vercel** (current host): `vercel.json` builds the CSS, serves `public/` statically, and routes all
other paths to `api/index.php` on the community [`vercel-php`](https://github.com/juicyfx/vercel-php)
runtime (`vercel-php@0.8.0`, PHP 8.4). In the Vercel project settings, set **Framework Preset → Other**
(the project was previously SvelteKit); `vercel.json` overrides the build/output settings.

**Apache / any PHP host:** point the DocumentRoot at the repository root; `.htaccess` serves `public/`
and routes everything else to `api/index.php`. Commit or upload a built `public/assets/css/app.css`.
