// Builds the Burst web app (../burst/ui) into public/, as part of `npm run build`.
//
// The SPA shell is written as public/app.html (not index.html), so it is only
// reached through proxy.ts, which requires a session. Hashed bundles go to
// public/assets/ and /env.js carries the runtime settings the SPA reads.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = join(dirname(fileURLToPath(import.meta.url)), '..');
const ui = join(web, '..', 'burst', 'ui');
const out = join(web, '.spa-build');
const pub = join(web, 'public');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
if (!existsSync(join(ui, 'node_modules'))) {
  execFileSync(npm, ['ci', '--no-audit', '--no-fund'], { cwd: ui, stdio: 'inherit' });
}
rmSync(out, { recursive: true, force: true });
execFileSync(npm, ['exec', '--', 'vite', 'build', '--outDir', out, '--emptyOutDir'], { cwd: ui, stdio: 'inherit' });

rmSync(join(pub, 'assets'), { recursive: true, force: true });
mkdirSync(pub, { recursive: true });
cpSync(join(out, 'assets'), join(pub, 'assets'), { recursive: true });
renameSync(join(out, 'index.html'), join(pub, 'app.html'));
// No external identity provider: the SPA signs in through /login on this app.
writeFileSync(join(pub, 'env.js'), `window.__BURST_ENV__ = ${JSON.stringify({ LOGIN_LOCAL: 'false' })};\n`);
rmSync(out, { recursive: true, force: true });
console.log('[build-spa] Burst web app written to public/');
