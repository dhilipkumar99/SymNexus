// Unit tests for campaign email building: no database or network needed.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { composeEmail, missingVariables, textToHtml } from '../lib/mail/compose.ts';
import { normalizeEmail, parseCsv, readRecipients } from '../lib/mail/csv.ts';
import { isHumanReply } from '../lib/mail/dispatch.ts';
import { classify } from '../lib/mail/graph.ts';
import { renderTemplate, TemplateError, templateVariables } from '../lib/mail/template.ts';

describe('templates', () => {
  test('variables, defaults and the reference project example', () => {
    const src = `Hello {{name}},
It looks like your experience with us is {% if feedback == "positive" %}positive{% else %}negative{% endif %}.`;
    assert.equal(renderTemplate(src, { name: 'Rob', feedback: 'Positive ' }), 'Hello Rob,\nIt looks like your experience with us is positive.');
    assert.equal(renderTemplate('Hi {{ first_name | default("there") }}!', { first_name: '  ' }), 'Hi there!');
    assert.equal(renderTemplate("Hi {{ first_name|default('a \\'friend\\'') }}", {}), "Hi a 'friend'");
  });

  test('if / elif / else / not / != and nesting', () => {
    const src = '{% if not company %}A{% elif tier == "gold" %}{% if vip %}B1{% else %}B2{% endif %}{% elif tier != "free" %}C{% else %}D{% endif %}';
    assert.equal(renderTemplate(src, {}), 'A');
    assert.equal(renderTemplate(src, { company: 'x', tier: 'GOLD', vip: 'y' }), 'B1');
    assert.equal(renderTemplate(src, { company: 'x', tier: 'gold' }), 'B2');
    assert.equal(renderTemplate(src, { company: 'x', tier: 'pro' }), 'C');
    assert.equal(renderTemplate(src, { company: 'x', tier: 'free' }), 'D');
  });

  test('a tag alone on its line leaves no blank line', () => {
    const src = 'Hi,\n  {% if company %}\nI saw {{ company }}.\n  {% endif %}\nThanks';
    assert.equal(renderTemplate(src, { company: 'Acme' }), 'Hi,\nI saw Acme.\nThanks');
    assert.equal(renderTemplate(src, {}), 'Hi,\nThanks');
  });

  test('clear errors with line numbers', () => {
    const err = (src: string) => assert.throws(() => renderTemplate(src, {}), TemplateError);
    err('a\n{% if x %}b');
    err('{% endif %}');
    err('{% else %}');
    err('{% if x %}{% else %}{% elif y %}{% endif %}');
    err('{% for x in y %}{% endfor %}');
    err('{{ first name }}');
    err('Hi {{ name');
    assert.throws(() => renderTemplate('ok\n\n{% if a b %}{% endif %}', {}), /Line 3/);
  });

  test('templateVariables reports names and whether each has a default', () => {
    const vars = templateVariables('{{ a }} {{ b | default("x") }} {% if c %}{{ c }}{% endif %} {% if d %}{% else %}{{ e }}{% endif %}');
    assert.deepEqual(Object.fromEntries([...vars].map(([k, v]) => [k, v.hasDefault])), { a: false, b: true, c: true, d: true, e: false });
  });
});

describe('CSV lists', () => {
  test('quotes, BOM, CRLF, semicolons and blank lines', () => {
    assert.deepEqual(parseCsv('﻿Name;Email\r\n"Doe; Jane";"jane@x.io"\r\n\r\n"Say ""hi""";b@x.io'), [
      ['Name', 'Email'],
      ['Doe; Jane', 'jane@x.io'],
      ['Say "hi"', 'b@x.io'],
    ]);
    assert.deepEqual(parseCsv('a,b\n"multi\nline",2'), [['a', 'b'], ['multi\nline', '2']]);
  });

  test('columns become variables; invalid and duplicate addresses are dropped', () => {
    const list = readRecipients('First Name,E-mail Address,Company,2024 Revenue,Company\nJane,Jane Doe <JANE@Acme.com>,Acme,1,x\nJoe,not-an-email,B,2,y\nJen,jane@acme.com,C,3,z\nJim, jim@b.co ,,4,w\n');
    assert.deepEqual(list.columns.map((c) => c.key), ['first_name', 'e_mail_address', 'company', 'col_2024_revenue', 'company_2']);
    assert.equal(list.emailColumn, 'e_mail_address');
    assert.deepEqual(list.recipients.map((r) => r.email), ['jane@acme.com', 'jim@b.co']);
    assert.equal(list.recipients[0].data.first_name, 'Jane');
    assert.equal(list.duplicates, 1);
    assert.deepEqual(list.invalid, [{ line: 3, value: 'not-an-email' }]);
  });

  test('a list without an email column is refused', () => {
    assert.throws(() => readRecipients('name,phone\nA,1'), /No email column/);
    assert.throws(() => readRecipients('email\n'), /header row and at least one/);
  });

  test('email normalisation', () => {
    assert.equal(normalizeEmail(' mailto:Bob@Example.CO.uk '), 'bob@example.co.uk');
    for (const bad of ['bob@', '@x.com', 'bob@x', 'bob smith@x.com', 'bob@x..com', 'bob@-x.com']) assert.equal(normalizeEmail(bad), null, bad);
  });
});

describe('composing emails', () => {
  const sender = { fromName: 'SymNexus', fromEmail: 'info@symnexus.co', signature: 'Best,\n{{ from_name }}', footer: 'SymNexus, 1 Main St' };

  test('personalised, escaped, linked, with signature and unsubscribe footer', () => {
    const e = composeEmail(
      { subject: 'Hi  {{ name }}\n', body: 'Hello {{ name }},\n\nSee https://symnexus.co/demo.\nThanks' },
      { name: 'Ann <script>' },
      sender,
      'https://team.example/unsubscribe/abc',
    );
    assert.equal(e.subject, 'Hi Ann <script>');
    assert.match(e.fragment, /Hello Ann &lt;script&gt;,/);
    assert.ok(!e.fragment.includes('<script>'));
    assert.match(e.fragment, /<a href="https:\/\/symnexus.co\/demo" [^>]*>https:\/\/symnexus.co\/demo<\/a>\.<br>Thanks/);
    assert.match(e.fragment, /Best,<br>SymNexus/);
    assert.match(e.fragment, /SymNexus, 1 Main St &middot; <a href="https:\/\/team.example\/unsubscribe\/abc"/);
    assert.match(e.html, /^<!DOCTYPE html>/);
  });

  test('paragraphs', () => {
    assert.equal(textToHtml('a\nb\n\n\n c '), '<p style="margin:0 0 12px">a<br>b</p>\n<p style="margin:0 0 12px">c</p>');
  });

  test('missing variables are reported, built-ins are not', () => {
    assert.deepEqual(missingVariables({ subject: '{{ from_name }}', body: '{{ name }} {% if plan %}{% endif %}' }, ['name']), ['plan']);
    assert.deepEqual(missingVariables({ subject: '', body: '' }, [], '{{ title }}'), ['title']);
  });
});

describe('Microsoft Graph and replies', () => {
  test('error classes', () => {
    assert.equal(classify(401, 'InvalidAuthenticationToken', ''), 'auth');
    assert.equal(classify(403, 'ErrorAccessDenied', ''), 'auth');
    assert.equal(classify(429, '', ''), 'throttled');
    assert.equal(classify(503, '', ''), 'throttled');
    assert.equal(classify(500, '', ''), 'transient');
    assert.equal(classify(404, 'ErrorInvalidUser', 'The requested user is invalid.'), 'auth');
    assert.equal(classify(404, 'ErrorItemNotFound', ''), 'rejected');
    assert.equal(classify(400, 'ErrorInvalidRecipients', ''), 'rejected');
  });

  test('bounces, auto-replies and our own mail are not replies', () => {
    const mb = 'info@symnexus.co';
    assert.equal(isHumanReply({ from: 'jane@acme.com', subject: 'RE: Quick question' }, mb), true);
    assert.equal(isHumanReply({ from: 'jane@acme.com', subject: 'Automatic reply: Quick question' }, mb), false);
    assert.equal(isHumanReply({ from: 'jane@acme.com', subject: 'Out of Office: back Monday' }, mb), false);
    assert.equal(isHumanReply({ from: 'postmaster@acme.com', subject: 'Undeliverable: Quick question' }, mb), false);
    assert.equal(isHumanReply({ from: 'mailer-daemon@googlemail.com', subject: 'Delivery Status Notification (Failure)' }, mb), false);
    assert.equal(isHumanReply({ from: mb, subject: 'Quick question' }, mb), false);
  });
});
