// Server-rendered pages the gateway owns (Burst has no password UI of its own).

const esc = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function accountPage({ appName, error = '', success = false, email = '' }) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Change password · ${esc(appName)}</title>
<style>
  :root { color-scheme: light dark; --bg:#f6f7f9; --card:#fff; --text:#111827; --muted:#6b7280; --line:#e5e7eb; --brand:#00796b; --err:#b91c1c; --errbg:#fef2f2; --ok:#047857; --okbg:#ecfdf5; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0b0f14; --card:#151a21; --text:#f3f4f6; --muted:#9ca3af; --line:#273040; --brand:#2dd4bf; --err:#fca5a5; --errbg:#3b1212; --ok:#6ee7b7; --okbg:#0f2e25; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px; background:var(--bg); color:var(--text); font:15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width:100%; max-width:400px; background:var(--card); border:1px solid var(--line); border-radius:16px; padding:28px; }
  h1 { font-size:20px; margin:0 0 4px; }
  p.lead { color:var(--muted); margin:0 0 20px; font-size:14px; }
  label { display:block; font-size:13px; font-weight:600; margin:14px 0 6px; }
  input { width:100%; padding:10px 12px; border:1px solid var(--line); border-radius:10px; background:transparent; color:inherit; font:inherit; }
  input:focus { outline:2px solid var(--brand); outline-offset:1px; }
  button { margin-top:20px; width:100%; padding:11px; border:0; border-radius:10px; background:var(--brand); color:#fff; font:inherit; font-weight:600; cursor:pointer; }
  .msg { border-radius:10px; padding:10px 12px; font-size:14px; margin-bottom:8px; }
  .err { background:var(--errbg); color:var(--err); }
  .ok { background:var(--okbg); color:var(--ok); }
  .hint { color:var(--muted); font-size:12px; margin-top:6px; }
  a { color:var(--brand); }
  .back { display:block; text-align:center; margin-top:18px; font-size:14px; }
</style>
</head>
<body>
<main>
  <h1>Change password</h1>
  <p class="lead">${esc(appName)}</p>
  ${error ? `<div class="msg err" role="alert">${esc(error)}</div>` : ''}
  ${success ? '<div class="msg ok" role="status">Password changed. Sign in again with your new password; other devices have been signed out.</div>' : ''}
  <form method="post" action="/account" autocomplete="on">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="username" required value="${esc(email)}">
    <label for="current">Current password</label>
    <input id="current" name="current_password" type="password" autocomplete="current-password" required>
    <label for="new">New password</label>
    <input id="new" name="new_password" type="password" autocomplete="new-password" minlength="12" required>
    <div class="hint">At least 12 characters. A passphrase of several words works well.</div>
    <button type="submit">Change password</button>
  </form>
  <a class="back" href="/">Back to ${esc(appName)}</a>
</main>
</body>
</html>`;
}
