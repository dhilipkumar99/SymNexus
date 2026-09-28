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

No local PHP? `docker run --rm -p 8000:8000 -v "$PWD":/app -w /app php:8.4-cli php -S 0.0.0.0:8000 -t public api/index.php`

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

The contact and demo forms open the visitor's email client with a pre-filled message to
`cell.ai.solutions@gmail.com` (no third-party form service, nothing to configure). Without
JavaScript they fall back to a plain `mailto:` submission.

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

## Deploying

**Vercel** (current host): `vercel.json` builds the CSS, serves `public/` statically, and routes all
other paths to `api/index.php` on the community [`vercel-php`](https://github.com/juicyfx/vercel-php)
runtime (`vercel-php@0.8.0`, PHP 8.4). In the Vercel project settings, set **Framework Preset → Other**
(the project was previously SvelteKit); `vercel.json` overrides the build/output settings.

**Apache / any PHP host:** point the DocumentRoot at the repository root; `.htaccess` serves `public/`
and routes everything else to `api/index.php`. Commit or upload a built `public/assets/css/app.css`.
