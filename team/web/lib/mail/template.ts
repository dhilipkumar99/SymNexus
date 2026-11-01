// The template language for campaign emails: a small subset of Jinja, so the
// usual cold-email templates work as written.
//
//   {{ first_name }}                         a column from the recipient list
//   {{ first_name | default("there") }}      fallback when the cell is empty
//   {% if company %} … {% elif plan == "pro" %} … {% else %} … {% endif %}
//
// Conditions are `name`, `not name`, `name == "text"` and `name != "text"`.
// A cell counts as set when it is not blank; comparisons ignore case and
// surrounding spaces, which suits spreadsheet data. A tag alone on its line
// takes the line with it, so conditionals do not leave blank lines behind.
//
// Pure: imported by the browser (live preview) and the server (sending).

export class TemplateError extends Error {}

type Cond = { name: string; op: 'set' | 'unset' | 'eq' | 'ne'; value: string };
type Branch = { cond: Cond | null; body: Node[] };
type Node =
  | { type: 'text'; value: string }
  | { type: 'var'; name: string; fallback: string | null }
  | { type: 'if'; branches: Branch[] };

const TAG = /\{\{([\s\S]*?)\}\}|\{%([\s\S]*?)%\}/g;
const NAME = '[A-Za-z_][A-Za-z0-9_]*';
const STRING = `"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'`;
const VAR_RE = new RegExp(`^\\s*(${NAME})\\s*(?:\\|\\s*default\\s*\\(\\s*(${STRING})\\s*\\)\\s*)?$`);
const COND_RE = new RegExp(`^(?:(not)\\s+)?(${NAME})\\s*(?:(==|!=)\\s*(${STRING}))?$`);

const unquote = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1');
const lineAt = (src: string, index: number) => src.slice(0, index).split('\n').length;

function parseVar(expr: string, line: number): Node {
  const m = VAR_RE.exec(expr);
  if (!m) throw new TemplateError(`Line ${line}: "{{${expr}}}" is not a variable. Use {{ column_name }} or {{ column_name | default("text") }}.`);
  return { type: 'var', name: m[1], fallback: m[2] ? unquote(m[2]) : null };
}

function parseCond(expr: string, line: number): Cond {
  const m = COND_RE.exec(expr.trim());
  if (!m || (m[1] && m[3])) {
    throw new TemplateError(`Line ${line}: cannot read the condition "${expr.trim()}". Use name, not name, name == "text" or name != "text".`);
  }
  if (m[3]) return { name: m[2], op: m[3] === '==' ? 'eq' : 'ne', value: unquote(m[4]) };
  return { name: m[2], op: m[1] ? 'unset' : 'set', value: '' };
}

export function parseTemplate(src: string): Node[] {
  const root: Node[] = [];
  const open: { node: Extract<Node, { type: 'if' }>; line: number }[] = [];
  const out = () => (open.length ? open[open.length - 1].node.branches.at(-1)!.body : root);
  const text = (value: string) => {
    if (value.includes('{{') || value.includes('{%')) {
      const at = src.indexOf(value) + Math.max(value.indexOf('{{'), value.indexOf('{%'));
      throw new TemplateError(`Line ${lineAt(src, at)}: a tag is opened but never closed.`);
    }
    if (value) out().push({ type: 'text', value });
  };

  let last = 0;
  for (const m of src.matchAll(TAG)) {
    const start = m.index;
    let end = start + m[0].length;
    let before = src.slice(last, start);
    const line = lineAt(src, start);

    if (m[2] !== undefined) {
      // A statement alone on its line: drop the line's indentation and newline.
      const lineStart = src.lastIndexOf('\n', start - 1) + 1;
      const after = /^[ \t]*(?:\r?\n|$)/.exec(src.slice(end));
      if (lineStart >= last && /^[ \t]*$/.test(src.slice(lineStart, start)) && after) {
        before = src.slice(last, lineStart);
        end += after[0].length;
      }
    }
    text(before);
    last = end;

    if (m[1] !== undefined) {
      out().push(parseVar(m[1], line));
      continue;
    }
    const stmt = m[2].trim();
    const keyword = stmt.split(/\s+/, 1)[0];
    const rest = stmt.slice(keyword.length);
    const top = open[open.length - 1];
    const hasElse = top?.node.branches.at(-1)!.cond === null;
    switch (keyword) {
      case 'if': {
        const node: Extract<Node, { type: 'if' }> = { type: 'if', branches: [{ cond: parseCond(rest, line), body: [] }] };
        out().push(node);
        open.push({ node, line });
        break;
      }
      case 'elif':
        if (!top) throw new TemplateError(`Line ${line}: {% elif %} without an {% if %} before it.`);
        if (hasElse) throw new TemplateError(`Line ${line}: {% elif %} cannot come after {% else %}.`);
        top.node.branches.push({ cond: parseCond(rest, line), body: [] });
        break;
      case 'else':
        if (!top) throw new TemplateError(`Line ${line}: {% else %} without an {% if %} before it.`);
        if (hasElse || rest.trim()) throw new TemplateError(`Line ${line}: unexpected {% ${stmt} %}.`);
        top.node.branches.push({ cond: null, body: [] });
        break;
      case 'endif':
        if (!top) throw new TemplateError(`Line ${line}: {% endif %} without an {% if %} before it.`);
        open.pop();
        break;
      default:
        throw new TemplateError(`Line ${line}: unknown tag {% ${stmt} %}. Only if, elif, else and endif are supported.`);
    }
  }
  text(src.slice(last));
  if (open.length) throw new TemplateError(`Line ${open[open.length - 1].line}: {% if %} is missing its {% endif %}.`);
  return root;
}

const clean = (v: string | undefined) => (v ?? '').trim();

function test(cond: Cond, data: Record<string, string>): boolean {
  const v = clean(data[cond.name]);
  switch (cond.op) {
    case 'set':
      return v !== '';
    case 'unset':
      return v === '';
    case 'eq':
      return v.toLowerCase() === cond.value.trim().toLowerCase();
    case 'ne':
      return v.toLowerCase() !== cond.value.trim().toLowerCase();
  }
}

function renderNodes(nodes: Node[], data: Record<string, string>): string {
  let s = '';
  for (const n of nodes) {
    if (n.type === 'text') s += n.value;
    else if (n.type === 'var') s += clean(data[n.name]) || (n.fallback ?? '');
    else {
      const branch = n.branches.find((b) => b.cond === null || test(b.cond, data));
      if (branch) s += renderNodes(branch.body, data);
    }
  }
  return s;
}

export function renderTemplate(src: string, data: Record<string, string>): string {
  return renderNodes(parseTemplate(src), data);
}

// Every name a template reads, and whether every use is safe when the cell is
// blank: it has a default, or sits inside {% if name %} (or == "something").
export function templateVariables(src: string): Map<string, { hasDefault: boolean }> {
  const found = new Map<string, { hasDefault: boolean }>();
  const walk = (nodes: Node[], guarded: ReadonlySet<string>) => {
    for (const n of nodes) {
      if (n.type === 'var') {
        const prev = found.get(n.name);
        found.set(n.name, { hasDefault: (prev?.hasDefault ?? true) && (n.fallback !== null || guarded.has(n.name)) });
      } else if (n.type === 'if') {
        for (const b of n.branches) {
          if (b.cond && !found.has(b.cond.name)) found.set(b.cond.name, { hasDefault: true });
          const nonBlank = b.cond && (b.cond.op === 'set' || (b.cond.op === 'eq' && b.cond.value.trim() !== ''));
          walk(b.body, nonBlank ? new Set([...guarded, b.cond!.name]) : guarded);
        }
      }
    }
  };
  walk(parseTemplate(src), new Set());
  return found;
}
