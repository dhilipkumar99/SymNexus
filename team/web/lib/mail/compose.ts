// Turns a step's template and one person's row into the email that is sent.
//
// Templates are written as plain text: blank lines separate paragraphs and
// links are made clickable. Every email ends with the sender's signature and a
// footer with an unsubscribe link. No tracking pixels or rewritten links: they
// hurt deliverability, and replies are what campaigns measure.
//
// Pure: used for the live preview in the browser and for sending.

import { renderTemplate, templateVariables } from './template.ts';

export interface Sender {
  fromName: string;
  fromEmail: string;
  signature: string;
  footer: string;
}

export interface Composed {
  subject: string;
  text: string; // the rendered body, before signature and footer
  fragment: string; // HTML for the body, signature and footer
  html: string; // fragment wrapped as a complete document
}

export const BUILT_IN_VARIABLES = ['from_name', 'from_email'] as const;

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const URL_RE = /\bhttps?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]'*]/g;

function linkify(escaped: string): string {
  return escaped.replace(URL_RE, (url) => `<a href="${url}" style="color:#00796b">${url}</a>`);
}

export function textToHtml(text: string, style = 'margin:0 0 12px'): string {
  return text
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n[ \t]*\n+/)
    .filter((p) => p.trim())
    .map((p) => `<p style="${style}">${linkify(escapeHtml(p.trim())).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

export function templateContext(sender: Pick<Sender, 'fromName' | 'fromEmail'>, data: Record<string, string>) {
  return { from_name: sender.fromName, from_email: sender.fromEmail, ...data };
}

export function composeEmail(
  template: { subject: string; body: string },
  data: Record<string, string>,
  sender: Sender,
  unsubscribeUrl: string,
): Composed {
  const ctx = templateContext(sender, data);
  const subject = renderTemplate(template.subject, ctx).replace(/\s+/g, ' ').trim();
  const text = renderTemplate(template.body, ctx).trim();
  const signature = sender.signature.trim() ? renderTemplate(sender.signature, ctx).trim() : '';

  const footer = [sender.footer.trim() ? escapeHtml(sender.footer.trim()).replace(/\n/g, '<br>') : '', `<a href="${escapeHtml(unsubscribeUrl)}" style="color:#888">Unsubscribe</a>`]
    .filter(Boolean)
    .join(' &middot; ');

  const fragment = [
    '<div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#111111">',
    textToHtml(text),
    signature ? textToHtml(signature, 'margin:16px 0 0') : '',
    `<p style="margin:24px 0 0;font-size:12px;color:#888888">${footer}</p>`,
    '</div>',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body style="margin:0;padding:0">\n${fragment}\n</body></html>`;
  return { subject, text, fragment, html };
}

// Names a template uses that the list (or the built-ins) does not provide.
export function missingVariables(template: { subject: string; body: string }, columns: string[], signature = ''): string[] {
  const available = new Set<string>([...columns, ...BUILT_IN_VARIABLES]);
  const used = new Set<string>();
  for (const src of [template.subject, template.body, signature]) for (const name of templateVariables(src).keys()) used.add(name);
  return [...used].filter((n) => !available.has(n));
}
