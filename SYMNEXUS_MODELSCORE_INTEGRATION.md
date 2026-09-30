# Integration brief: "Solutions" page ↔ the nine SymNexus(x) product sites (ModelsCore)

Audience: a Claude agent (or developer) working **in this repo** (`/Users/dhilipraman/Documents/Python/SymNexus`).
Goal: add one new page where sales associates and customers browse the nine SymNexus(x) products and their
tasks, using the same task buttons as the product sites. Clicking a task opens that task's page on the
matching product site. From there, a prominent button opens the project questionnaire, which downloads a PDF.

This file is the only thing added to this repo so far. Nothing else here was changed.

---

## 1. The two codebases

| | This repo (SymNexus main site) | ModelsCore product sites |
|---|---|---|
| Path | `/Users/dhilipraman/Documents/Python/SymNexus` | `/Users/dhilipraman/Documents/Python/ModelsCore/<repo>/site/` (×9) |
| Stack | PHP 8, route table, Tailwind 3, SPA fragment router | Zero-dependency Node server (`server.js`), same Tailwind look and the same SPA protocol |
| Run | `npm run dev` (`php -S localhost:8000 -t public api/index.php`), or `npm run dev:docker` (PHP is not installed on this Mac) | `cd <repo>/site && npm run dev` |
| Generator | n/a | `ModelsCore/site_builder/build_sites.py` (do not hand-edit `site/`; rebuild) |

### The nine products

| Product | Local URL | Env var (suggested) | Tasks | primary / accent |
|---|---|---|---|---|
| SymNexusPredict  | http://localhost:3101 | `SYMNEXUS_PREDICT_URL`  | 26 | `#4f46e5` / `#0ea5e9` |
| SymNexusForecast | http://localhost:3102 | `SYMNEXUS_FORECAST_URL` | 8  | `#b45309` / `#ea580c` |
| SymNexusSentinel | http://localhost:3103 | `SYMNEXUS_SENTINEL_URL` | 11 | `#be123c` / `#9333ea` |
| SymNexusExtract  | http://localhost:3104 | `SYMNEXUS_EXTRACT_URL`  | 13 | `#047857` / `#0d9488` |
| SymNexusGen      | http://localhost:3105 | `SYMNEXUS_GEN_URL`      | 14 | `#7c3aed` / `#db2777` |
| SymNexusVision   | http://localhost:3106 | `SYMNEXUS_VISION_URL`   | 10 | `#0e7490` / `#2563eb` |
| SymNexusMatch    | http://localhost:3107 | `SYMNEXUS_MATCH_URL`    | 8  | `#a21caf` / `#4f46e5` |
| SymNexusDecide   | http://localhost:3108 | `SYMNEXUS_DECIDE_URL`   | 15 | `#c2410c` / `#dc2626` |
| SymNexusVoice    | http://localhost:3109 | `SYMNEXUS_VOICE_URL`    | 3  | `#1d4ed8` / `#06b6d4` |

There are 108 tasks in total. Task slugs are unique across all products, so a slug identifies exactly one product.

### URLs on every product site

| URL | What it is |
|---|---|
| `/` | Overview, including a grid of task buttons |
| `/tasks/<slug>` | **Task page.** This is the link target from the new page. It has a centred "Start your project questionnaire" button near the top. |
| `/consult?task=<slug>` | Questionnaire (standalone page, no site chrome; meant for a phone-sized popup window) |
| `/consult` | Same questionnaire without a task ("general") |
| `/task`, `/data`, `/platform` | How it works, data format, interactive demo |

An unknown slug returns the site's 404 page, because `server.js` validates it against the files in `pages/tasks/`.

---

## 2. Source of truth: the exported catalog

Do not retype the product and task lists. Regenerate them from ModelsCore:

```bash
cd /Users/dhilipraman/Documents/Python/ModelsCore
python3 site_builder/export_catalog.py
```

This writes `ModelsCore/site_builder/export/`:

- `symnexus_catalog.json`: `{generated_by, products:[…]}`
- `modelscore.php`: the same `products` array as a PHP file that `return`s it (`declare(strict_types=1)`). **Copy it to `src/data/modelscore.php`.**
- `icons/*.png`: 91 task icons, about 1:1 and transparent, drawn in coloured strokes. **Copy them to `public/assets/images/tasks/`.**

Shape of one product (every value is a string except `port`):

```json
{
  "key": "predict", "name": "SymNexusPredict", "word": "Predict",
  "tagline": "Know what happens next, from the data you already have.",
  "lead": "SymNexusPredict turns spreadsheets and database tables into …",
  "env_var": "SYMNEXUS_PREDICT_URL", "dev_url": "http://localhost:3101", "port": 3101,
  "repo": "GradientBoostedDecisionTrees_TabularPrediction",
  "colors": {"primary": "#4f46e5", "primary_dark": "#818cf8", "accent": "#0ea5e9"},
  "tasks": [
    {"slug": "customer-churn", "title": "Customer Churn", "dept": "Marketing",
     "sub": "Keep customers before they go", "icon": "r02c6.png",
     "path": "/tasks/customer-churn", "consult_path": "/consult?task=customer-churn"}
  ]
}
```

Rules for public copy:

- **Never show `repo` publicly.** The repo names contain model types, and the public sites must not name models or specs.
- `port` and `dev_url` are only for building URLs.

When ModelsCore tasks change, re-run the export and re-copy both the PHP file and the icons. Mention this in a comment at the top of the page template.

---

## 3. How this repo works (what you must follow)

- **Routes.** `src/app.php` → `const ROUTES`. The key is the clean path; the value is `['page' => <file in src/pages>, 'priority' => '0.x'|null]`. `priority` feeds `/sitemap.xml`; `null` hides the page from the sitemap. `REDIRECTS` holds legacy URLs. Paths are canonicalised by stripping trailing slashes and collapsing duplicate `//`.
- **Bootstrap.** `src/bootstrap.php` defines the constants (`SITE_URL = 'https://symnexus.co'`, `SRC_DIR`, `PUBLIC_DIR`) and `require_once`s `src/data/{images,nav,products,forms}.php` and `src/includes/icons.php`. `load_env()` reads `.env` locally (process env wins). On Vercel, env comes from project settings. Helpers:
  - `e()`: HTML-escape. Use it on **every** dynamic value, including URLs in `href`.
  - `asset('images/x.png')`: cache-busted `/assets/...?v=hash`.
  - `env('KEY', default)`
  - `partial('name', [...])`: loads `src/partials/<name>.php`.
  - `img('key', width)`: Unsplash URL helper from `src/data/images.php`.
  - `icon()`: heroicons, from `src/includes/icons.php`.
  - `is_active()` and `current_path()`.
- **Page template pattern.** See `src/pages/products.php`: set `$pageTitle` (format `'Title — Symnexus'`) and `$pageMeta` (`description`, optional `og_image`). Then `require SRC_DIR . '/includes/header.php';`, then markup, then `require SRC_DIR . '/includes/footer.php';`. For SPA requests (`X-SPA-Request: true`), header and footer emit only the fragment and set `X-SPA-Fragment` / `X-SPA-Title`, so pages need no special code.
- **Partials.** `src/partials/`:
  - `page-header` (`eyebrow`, `title`, `highlight`, `lead`, `sublead`; renders `.badge`, h1 with `text-brandPrimary` highlight)
  - `cta`, `carousel`, `contact-form`, `legal`, `logo-frame`, `chat-widget`
- **Navigation.** `src/data/nav.php`. `NAV_LINKS` entries are `['label','href','match'=>[prefixes]]`; `FOOTER_LINKS` has the same shape without `match`.
- **Styling.**
  - `tailwind.config.js` scans `./src/**/*.php` and `./public/assets/js/**/*.js`. Classes you write in PHP templates are picked up, but classes built at runtime from strings are not.
  - Colours: `brandPrimary` = `rgb(var(--brand-primary))`, which is teal (`15 118 110` light, `20 184 166` dark), and `brandNeutral`.
  - Components live in `src/css/app.css` (`@layer components`): `.card`, `.panel`, `.btn-primary`, `.pill`, `.badge`, `.body-copy`, etc.
  - Build with `npm run build` (Vercel runs it).
  - **This repo has no `brand-gradient` class**; the product sites do (section 5).
- **SPA router.** `public/assets/js/spa-router.js` intercepts same-origin `<a>` clicks. It ignores links that:
  - have `target` other than `_self`,
  - have `download` or `data-no-spa`,
  - point to a different origin (`url.origin !== location.origin`).

  Links to the product sites are cross-origin, so they already do a normal full navigation. After each swap it re-runs inline `<script>`s in the new fragment and dispatches `spa:pageLoaded` on `document`. Delegated listeners attached once on `document` keep working.
- **Service worker.** `public/sw.js` is network-first for navigations and never touches cross-origin requests. Nothing to change.
- **Security headers.** Set in `send_common_headers()`: `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. There is no CSP, so `window.open` to another origin is fine. **Do not iframe the product sites**; open them in a tab or popup.
- **Deploy.** `vercel.json` rewrites everything to `api/index.php?__path=` and serves `public/` statically. `.htaccess` gives Apache the same behaviour. New files under `public/assets/` are cached for a year, which is fine because `asset()` cache-busts.
- **AI assistant.** `src/ai/instructions.md` is the chat widget's knowledge.

---

## 4. Implementation plan

1. **Data.** Copy `ModelsCore/site_builder/export/modelscore.php` → `src/data/modelscore.php`. Load it where it is used, e.g. at the top of the page: `$products = require SRC_DIR . '/data/modelscore.php';`. That avoids touching `bootstrap.php`. If you prefer a constant, add a `require_once` in bootstrap and `const MODELSCORE = …`, but the generated file `return`s an array.
2. **Icons.** Copy `ModelsCore/site_builder/export/icons/*.png` → `public/assets/images/tasks/`. Reference them with `asset('images/tasks/' . $t['icon'])`.
3. **Base URLs.** Add a helper, e.g. in the page or a small `src/data/modelscore-urls.php`:
   ```php
   function modelscore_base(array $p): string
   {
       return rtrim(env($p['env_var'], $p['dev_url']), '/');   // prod: set SYMNEXUS_<WORD>_URL
   }
   ```
   Then add the nine vars (commented) to `.env.example`:
   ```
   # ModelsCore product sites (defaults to http://localhost:3101…3109 when unset)
   # SYMNEXUS_PREDICT_URL="https://predict.symnexus.co"
   ```
   **Production values (decided):** `SYMNEXUS_PREDICT_URL=https://predict.symnexus.co`, and the same pattern for
   `forecast`, `sentinel`, `extract`, `gen`, `vision`, `match`, `decide` and `voice`. The catalog also carries them as
   `prod_url`. Each product site is its own Vercel project (`symnexus<word>`), deployed by
   `ModelsCore/site_builder/deploy_sites.sh`. With `SET_MAIN_ENV=1`, that script also sets these nine vars on this
   repo's Vercel project (`symnexus`); a redeploy of this project is then needed. The product sites link back to
   `https://symnexus.co/solutions`, which now redirects to `/products` (the catalog's current home), so keep that redirect.
   Before this, the product sites only ran locally. For production they must be deployed. Each is a plain Node 18 app (`node server.js`, port hard-coded in `server.js`), so a small VM, Render or Fly works, and the env vars then point at those hosts. They are not Vercel-PHP apps. Until the vars are set, links go to localhost, which is fine for local demos only. Consider hiding the page from the sitemap (`priority => null`) until the product sites are public.
4. **Route.** Add to `ROUTES` in `src/app.php`, e.g. `'/solutions' => ['page' => 'solutions', 'priority' => '0.8'],`. Name it as the owner prefers; "Solutions" fits the products page.
5. **Nav.** Either add `['label' => 'Solutions', 'href' => '/solutions', 'match' => ['/solutions']]` to `NAV_LINKS` and `FOOTER_LINKS`, or add `'/solutions'` to the Products link's `match` list and link to it from `src/pages/products.php`. Keep the nav short on mobile, and check `src/includes/header.php` for how many items fit.
6. **Page** `src/pages/solutions.php`, top to bottom:
   - `partial('page-header', …)`, e.g. eyebrow "Solutions", title "Find the right", highlight "SymNexus product", lead on picking a task.
   - **Product selector:** nine segmented buttons, each tinted with its product colours. Clicking one shows that product's tagline and lead plus its task grid. Implement it with anchors `#predict`… and a tiny inline script, or render all nine sections stacked with a sticky product pill bar. Either way it must work without JS: render every section, and have the script only hide and show them. The SPA router re-runs inline scripts on swap. Guard double-binding, or bind on `document`.
   - **Task grid per product:** the same buttons as the product sites (section 5). Each links to `modelscore_base($p) . $t['path']`.
   - Optional **search/filter** input (by title, dept, sub) and filter chips by department (`dept`: Data, Marketing, Sales, Operations…, Customer Service, HR, Health…, Finance & Legal, Construction, …).
   - Optional per-task secondary link "Questionnaire" → `modelscore_base($p) . $t['consult_path']` with `data-consult` (section 6).
   - End with the existing `partial('cta', …)` if it fits.
7. **Styles.** Add the small component CSS from section 5 to `src/css/app.css`, then run `npm run build`.
8. **Assistant knowledge.** Add a short section to `src/ai/instructions.md`: the nine products, one line each (use `tagline`), and that `/solutions` lists their tasks. No model names or specs.
9. **Test** (section 7).

---

## 5. Task-button markup (match the product sites)

Product-site buttons, as generated by `task_buttons()` in `ModelsCore/site_builder/build_sites.py`:

- A white rounded rectangle with a 2px border.
- Inside: a 48px white icon tile with a 36px icon, then the title (semibold) and a small grey line `"{dept} · {sub}"`.
- The active or first button is filled with the product gradient and white text.
- The grid sits in a light grey tray: 1/2/3/4 columns at sm/lg/xl.

Because this repo's `--brand-primary` is teal, **scope each product's colours with CSS variables on the section** instead of changing the global theme. Add to `src/css/app.css` inside `@layer components`:

```css
/* Each section sets --mc-light, --mc-dark and --mc-accent inline; --mc-primary is derived here so dark mode can switch it. */
.mc-product { --mc-primary: var(--mc-light, 79 70 229); }
.dark .mc-product { --mc-primary: var(--mc-dark, 129 140 248); }
.mc-gradient { background-image: linear-gradient(135deg, rgb(var(--mc-primary)) 0%, rgb(var(--mc-accent)) 100%); }
.mc-text-gradient { background-image: linear-gradient(135deg, rgb(var(--mc-primary)) 0%, rgb(var(--mc-accent)) 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
.mc-task { border-color: rgb(209 213 219); }
.mc-task:hover { border-color: rgb(var(--mc-primary)); color: rgb(var(--mc-primary)); }
.dark .mc-task { border-color: rgb(75 85 99); }
```

Convert the hex colours to `R G B` triplets in PHP:

```php
function mc_rgb(string $hex): string
{
    return implode(' ', array_map('hexdec', str_split(ltrim($hex, '#'), 2)));
}
```

Template (escape everything):

```php
<section id="<?= e($p['key']) ?>" class="mc-product mb-16"
    style="--mc-light: <?= e(mc_rgb($p['colors']['primary'])) ?>; --mc-dark: <?= e(mc_rgb($p['colors']['primary_dark'])) ?>; --mc-accent: <?= e(mc_rgb($p['colors']['accent'])) ?>;">
    <h2 class="font-headline font-bold text-3xl mb-2">SymNexus<span class="mc-text-gradient"><?= e($p['word']) ?></span></h2>
    <p class="body-copy mb-6 max-w-3xl"><?= e($p['tagline']) ?></p>
    <div class="rounded-2xl bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-gray-700/50 p-3 sm:p-4">
        <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <?php foreach ($p['tasks'] as $t): ?>
                <a href="<?= e(modelscore_base($p) . $t['path']) ?>"
                   class="mc-task group flex flex-col items-center justify-center text-center rounded-xl border-2 px-4 py-4 min-h-[88px] bg-white dark:bg-[#3a3d48] text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2">
                    <span class="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                        <img src="<?= e(asset('images/tasks/' . $t['icon'])) ?>" alt="" width="40" height="40" class="w-9 h-9 object-contain" loading="lazy">
                    </span>
                    <span class="font-sans font-semibold text-base sm:text-lg leading-snug"><?= e($t['title']) ?></span>
                    <span class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400"><?= e($t['dept']) ?> · <?= e($t['sub']) ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
```

Notes:

- The icon tile stays white in dark mode on purpose, because the icons are coloured strokes on transparent.
- Check that the dark surface (`bg-[#3a3d48]`) matches this site's dark palette (`dark:bg-slate-900` on cards). Adjust to `dark:bg-slate-900 dark:border-slate-700` if it looks off.
- Same-tab navigation is the requested behaviour ("take them to the relevant task page"). If the owner prefers a new tab, add `target="_blank" rel="noopener"`; the SPA router already ignores those links.
- The product selector buttons can reuse `.mc-gradient` for the selected product (white text) and the `.mc-task` style for the others.

---

## 6. The questionnaire (lives on the product sites)

**What it is.** It is a Spark-onboarding-style flow: a big light-grey prompt with one dark highlighted word, pill options that advance on tap, a pinned CONTINUE button, a back arrow and a progress bar. It asks seven questions:

1. Locality
2. Data security, with a note that sensitive data may require on-site deployment
3. Access frequency
4. Employee count
5. Location (free text)
6. Expected use period, with a preface about client ownership
7. Notes (free text)

Every choice question also has "Something else – write your own answer". On finishing, it **automatically downloads a PDF** named `SymNexus<Word>_<slug|general>_questionnaire_<YYYY-MM-DD>.pdf`. The done screen offers "Download again", "Start over" and "Close window". Answers persist in `sessionStorage` per product and task until finished or restarted.

- Files, all in ModelsCore:
  - `site_builder/site_template/public/assets/js/consult.js` (questions, flow)
  - `…/pdf.js` (dependency-free PDF writer)
  - `consult_page()` in `build_sites.py` (page shell)
- Task pages link to it with a centred gradient button near the top:
  `<a href="/consult?task=<slug>" target="_blank" rel="noopener" data-consult …>Start your project questionnaire</a>`.
- A delegated click handler (`platform.js`) opens it in a **separate phone-sized window**, falling back to a new tab if popups are blocked.

**Linking to it from this repo (optional).** A direct questionnaire link per task, or a general "Plan your project" button, can reuse the popup behaviour. Add this once, e.g. to `public/assets/js/site.js` or an inline script in the page. It binds on `document`, so it survives SPA swaps; guard it with a flag if placed inline.

```js
if (!window.__mcConsultBound) {
    window.__mcConsultBound = true;
    document.addEventListener('click', function (e) {
        var a = e.target instanceof Element ? e.target.closest('a[data-consult]') : null;
        if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        var w = 460, h = Math.min(900, (window.screen && window.screen.availHeight) || 900);
        var left = Math.max(0, (window.screenX || 0) + ((window.outerWidth || w) - w) / 2);
        var win = window.open(a.href, 'symnexus-consult', 'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + Math.max(0, (window.screenY || 0) + 40));
        if (win) win.focus(); else window.open(a.href, '_blank');
    });
}
```

Markup: `<a href="<?= e(modelscore_base($p) . $t['consult_path']) ?>" target="_blank" rel="noopener" data-consult>Questionnaire</a>`.

The questionnaire's colours come from the product site, so it always matches the product. Nothing about it needs to be reimplemented here.

---

## 7. Testing checklist

1. Start the product sites. Each is a separate process:
   ```bash
   cd /Users/dhilipraman/Documents/Python/ModelsCore
   for d in */site; do (cd "$d" && nohup node server.js >/dev/null 2>&1 &); done
   # stop later: pkill -f "node server.js"
   ```
2. Start this site with `npm run dev:docker`, or `npm run dev` if PHP 8 is installed, and run `npm run build` (or `watch`) for CSS.
3. On `/solutions`:
   - All nine products and 108 task buttons render with icons in light and dark mode.
   - Each product section has its own colours, and the rest of the site stays teal.
   - There is no horizontal scroll at 375px.
4. Click a task. It should do a full navigation to `http://localhost:31xx/tasks/<slug>` and show the right page, not the 404. Spot-check one task per product, and all 108 with a script: `curl -s -o /dev/null -w "%{http_code}"` on every URL built from the JSON.
5. On the task page, click "Start your project questionnaire". It should open a popup, complete all 7 steps, and `*_questionnaire_*.pdf` should download automatically.
6. Navigate to `/solutions` via the SPA router (click the nav link from another page) and check the product selector script still works. Also load it directly.
7. `curl -H "X-SPA-Request: true" -i localhost:8000/solutions` should return `X-SPA-Fragment: 1`, with the title in `X-SPA-Title`.
8. Check `/sitemap.xml` includes or excludes `/solutions` as intended.

## 8. Do / don't

- Do regenerate the data from ModelsCore; don't hand-edit the task list here.
- Don't edit the product sites' `site/` folders. Change `ModelsCore/site_builder/*` and rebuild with `python3 site_builder/build_sites.py`.
- Don't show model names, model types, repo names or specs on public pages.
- Keep every product site's footnote "* This is a sample result, not a live model run." That lives on the product sites and is not your concern here.
- Never commit `.env` files or keys.
