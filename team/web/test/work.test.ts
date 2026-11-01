// Unit tests for the team tools: wiki Markdown, slugs and CRM export.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

process.env.SESSION_SECRET = 'z'.repeat(48);
const { renderMarkdown } = await import('../lib/work/markdown.ts');
const { slugify } = await import('../lib/work/wiki.ts');
const { contactsCsv } = await import('../lib/work/crm.ts');
const { readRecipients } = await import('../lib/mail/csv.ts');

describe('wiki markdown', () => {
  test('headings, lists, checkboxes, quotes, code and rules', () => {
    const html = renderMarkdown('# Title\n\nSome *text* and **bold**.\nSecond line\n\n- a\n- [x] done\n- [ ] todo\n\n1. one\n2. two\n\n> quoted\n\n```\n<b>raw</b>\n```\n\n---');
    assert.equal(
      html,
      [
        '<h2>Title</h2>',
        '<p>Some <em>text</em> and <strong>bold</strong>.<br>Second line</p>',
        '<ul><li>a</li><li><label><input type="checkbox" disabled checked> done</label></li><li><label><input type="checkbox" disabled> todo</label></li></ul>',
        '<ol><li>one</li><li>two</li></ol>',
        '<blockquote><p>quoted</p></blockquote>',
        '<pre><code>&lt;b&gt;raw&lt;/b&gt;</code></pre>',
        '<hr>',
      ].join('\n'),
    );
  });

  test('links: safe schemes only, external ones open in a new tab', () => {
    assert.equal(renderMarkdown('[site](https://symnexus.co)'), '<p><a href="https://symnexus.co" target="_blank" rel="noopener noreferrer">site</a></p>');
    assert.equal(renderMarkdown('[crm](/crm)'), '<p><a href="/crm">crm</a></p>');
    assert.equal(renderMarkdown('[x](javascript:alert(1))'), '<p>[x](javascript:alert(1))</p>');
    assert.equal(renderMarkdown('see https://a.io/x.'), '<p>see <a href="https://a.io/x" target="_blank" rel="noopener noreferrer">https://a.io/x</a>.</p>');
    assert.equal(renderMarkdown('`a*b*c` snake_case_name'), '<p><code>a*b*c</code> snake_case_name</p>');
  });

  test('never emits markup from the source', () => {
    const html = renderMarkdown('<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n[a](https://x.io/"onmouseover="alert(1))');
    assert.ok(!/<script|<img|"onmouseover/.test(html), html);
  });
});

describe('wiki slugs', () => {
  test('from titles', () => {
    assert.equal(slugify('How we work'), 'how-we-work');
    assert.equal(slugify('  Café — Q4 plan!  '), 'cafe-q4-plan');
    assert.equal(slugify('!!!'), '');
  });
});

describe('CRM export', () => {
  test('a CSV the campaign tool reads, with formulas neutralised', () => {
    const base = { phone: '', title: 'PI', source: '', valueUsd: null, ownerId: null, ownerName: 'Ann Lee', nextStep: '', nextStepOn: null, createdBy: 'x', createdAt: new Date(), updatedAt: new Date() };
    const csv = contactsCsv([
      { ...base, id: '1', name: 'Jane Q Doe', email: 'jane@lab.org', organization: 'Lab, Inc.', stage: 'lead' },
      { ...base, id: '2', name: '=HYPERLINK("x")', email: 'evil@x.io', organization: '', stage: 'won' },
    ]);
    const list = readRecipients(csv);
    assert.equal(list.emailColumn, 'email');
    assert.deepEqual(list.recipients.map((r) => [r.data.first_name, r.data.last_name, r.data.organization, r.data.stage]), [
      ['Jane', 'Q Doe', 'Lab, Inc.', 'Lead'],
      ["'=HYPERLINK(\"x\")", '', '', 'Won'],
    ]);
  });
});
