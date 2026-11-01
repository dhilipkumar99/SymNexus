// Recipient lists: a CSV file (as exported by Excel, Google Sheets, a CRM)
// with a header row and one column holding email addresses. Every column
// becomes a template variable, named after its header in snake_case
// ("First Name" -> first_name).
//
// Pure: used in the browser (instant summary) and on the server (import).

export const MAX_RECIPIENTS = 5000;

export interface Column {
  key: string; // the template variable
  label: string; // the header as written
}

export interface RecipientList {
  columns: Column[];
  emailColumn: string;
  recipients: { email: string; data: Record<string, string> }[];
  invalid: { line: number; value: string }[];
  duplicates: number;
}

export class CsvError extends Error {}

// RFC 4180, plus the delimiter Excel uses in the file's locale (, ; or tab).
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, '');
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const delimiter = [',', ';', '\t'].reduce((best, d) =>
    firstLine.split(d).length > firstLine.split(best).length ? d : best,
  );

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && field === '') quoted = true;
    else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

export function columnKey(label: string, index: number): string {
  const key = label
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!key) return `column_${index + 1}`;
  return /^[0-9]/.test(key) ? `col_${key}` : key;
}

const EMAIL_RE = /^[^\s@<>()",;:[\]\\]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;

// "Jane Doe <Jane@Example.com>" and " jane@example.com " -> jane@example.com
export function normalizeEmail(value: string): string | null {
  const inner = /<([^>]+)>/.exec(value)?.[1] ?? value;
  const email = inner.trim().replace(/^mailto:/i, '').toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

export function readRecipients(csv: string, emailColumn?: string): RecipientList {
  const rows = parseCsv(csv);
  if (rows.length < 2) throw new CsvError('The file needs a header row and at least one person.');

  const columns: Column[] = [];
  const seen = new Set<string>();
  rows[0].forEach((label, i) => {
    let key = columnKey(label, i);
    for (let n = 2; seen.has(key); n++) key = `${columnKey(label, i)}_${n}`;
    seen.add(key);
    columns.push({ key, label: label.trim() || `Column ${i + 1}` });
  });

  const emailKey =
    emailColumn ??
    columns.find((c) => ['email', 'email_address', 'e_mail', 'mail', 'work_email'].includes(c.key))?.key ??
    columns.find((c) => /(^|_)e_?mail(_|$)/.test(c.key))?.key;
  const emailIndex = columns.findIndex((c) => c.key === emailKey);
  if (emailIndex < 0) {
    throw new CsvError(`No email column found. Name one of the columns "Email". Columns: ${columns.map((c) => c.label).join(', ')}.`);
  }

  const recipients: RecipientList['recipients'] = [];
  const invalid: RecipientList['invalid'] = [];
  const emails = new Set<string>();
  let duplicates = 0;
  for (let r = 1; r < rows.length; r++) {
    const raw = rows[r][emailIndex] ?? '';
    const email = normalizeEmail(raw);
    if (!email) {
      invalid.push({ line: r + 1, value: raw.trim() });
      continue;
    }
    if (emails.has(email)) {
      duplicates++;
      continue;
    }
    emails.add(email);
    const data: Record<string, string> = {};
    columns.forEach((c, i) => (data[c.key] = (rows[r][i] ?? '').trim()));
    data[columns[emailIndex].key] = email;
    recipients.push({ email, data });
  }
  if (!recipients.length) throw new CsvError('None of the rows has a valid email address.');
  if (recipients.length > MAX_RECIPIENTS) {
    throw new CsvError(`The list has ${recipients.length} people; a campaign can have at most ${MAX_RECIPIENTS}. Split it into several campaigns.`);
  }
  return { columns, emailColumn: columns[emailIndex].key, recipients, invalid, duplicates };
}
