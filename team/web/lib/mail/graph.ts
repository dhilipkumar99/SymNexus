// Sends and reads campaign mail through Microsoft Graph, as the shared mailbox
// (CAMPAIGN_MAILBOX, info@symnexus.co by default).
//
// Microsoft 365 no longer accepts passwords over SMTP, so this uses an Entra ID
// app registration with the client-credentials flow:
//   MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET
// The app needs the Mail.Send and Mail.ReadWrite application permissions, and
// should be limited to the one mailbox (see README: "Email campaigns").
//
// Each email is created as a draft and then sent, so its id and conversation
// are known: follow-ups go out as replies in the same thread, and replies are
// matched to the people who sent them. Ids are requested as immutable, so they
// survive the move from Drafts to Sent Items.

const GRAPH = 'https://graph.microsoft.com/v1.0';

export interface Outgoing {
  to: string;
  subject: string;
  html: string; // a complete document, for new emails
  fragment: string; // the same content without <html>/<body>, for replies
}

export interface Sent {
  messageId: string;
  conversationId: string | null;
}

export interface Inbound {
  from: string;
  subject: string;
  conversationId: string | null;
  receivedAt: Date;
}

export interface Mailer {
  mailbox: string;
  send(message: Outgoing): Promise<Sent>;
  // Replies in the thread of an earlier email; a blank subject keeps "RE: …".
  reply(threadMessageId: string, message: Outgoing): Promise<Sent>;
  // Mail received since a time, oldest first; `more` when the page limit cut it short.
  received(since: Date, maxPages?: number): Promise<{ messages: Inbound[]; more: boolean }>;
  check(): Promise<void>;
}

// auth: the mailbox or the app's permissions are wrong (stop everything).
// throttled: Microsoft asked us to slow down (stop this run, retry later).
// transient: a server error (retry this email later).
// rejected: this email cannot be sent (e.g. an invalid recipient).
export type MailErrorKind = 'auth' | 'throttled' | 'transient' | 'rejected';

export class MailError extends Error {
  readonly kind: MailErrorKind;
  readonly retryAfterSeconds: number;
  constructor(message: string, kind: MailErrorKind, retryAfterSeconds = 0) {
    super(message);
    this.kind = kind;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export interface GraphConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  mailbox: string;
}

export function graphConfigFromEnv(): GraphConfig | null {
  const { MICROSOFT_TENANT_ID: tenantId, MICROSOFT_CLIENT_ID: clientId, MICROSOFT_CLIENT_SECRET: clientSecret } = process.env;
  if (!tenantId || !clientId || !clientSecret) return null;
  return { tenantId, clientId, clientSecret, mailbox: (process.env.CAMPAIGN_MAILBOX ?? 'info@symnexus.co').trim().toLowerCase() };
}

let cachedToken: { key: string; token: string; until: number } | null = null;

async function accessToken(cfg: GraphConfig): Promise<string> {
  const key = `${cfg.tenantId}:${cfg.clientId}`;
  if (cachedToken?.key === key && cachedToken.until > Date.now() + 60_000) return cachedToken.token;
  let res: Response;
  try {
    res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        scope: 'https://graph.microsoft.com/.default',
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new MailError('Could not reach Microsoft sign-in.', 'transient');
  }
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !body.access_token) {
    // The first line of the description names the problem (e.g. an expired secret).
    const why = body.error_description?.split(/\r?\n/)[0] ?? `HTTP ${res.status}`;
    throw new MailError(`Microsoft sign-in failed: ${why}`, res.status >= 500 ? 'transient' : 'auth');
  }
  cachedToken = { key, token: body.access_token, until: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return body.access_token;
}

function retryAfter(res: Response): number {
  const s = Number(res.headers.get('retry-after'));
  return Number.isFinite(s) && s > 0 ? Math.min(s, 3600) : 60;
}

export function classify(status: number, code: string, message: string): MailErrorKind {
  if (status === 401 || status === 403) return 'auth';
  if (status === 429 || status === 503 || status === 504) return 'throttled';
  if (status >= 500) return 'transient';
  // The mailbox itself is missing: a configuration problem, not this email's.
  if (status === 404 && /ErrorInvalidUser|MailboxNotEnabled|MailboxNotFound|ResourceNotFound.*user/i.test(`${code} ${message}`)) return 'auth';
  return 'rejected';
}

export function graphMailer(cfg: GraphConfig): Mailer {
  const user = `/users/${encodeURIComponent(cfg.mailbox)}`;

  async function call<T>(method: string, pathOrUrl: string, body?: unknown): Promise<T> {
    const token = await accessToken(cfg);
    let res: Response;
    try {
      res = await fetch(pathOrUrl.startsWith('https://') ? pathOrUrl : `${GRAPH}${pathOrUrl}`, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          prefer: 'IdType="ImmutableId"',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new MailError('Microsoft Graph did not respond.', 'transient');
    }
    if (res.ok) return (res.status === 202 || res.status === 204 ? null : await res.json()) as T;
    const err = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
    const code = err?.error?.code ?? '';
    const message = err?.error?.message ?? res.statusText;
    const kind = classify(res.status, code, message);
    throw new MailError(`${message}${code ? ` (${code})` : ''}`, kind, kind === 'throttled' ? retryAfter(res) : 0);
  }

  async function sendDraft(draft: { id: string; conversationId?: string | null }): Promise<Sent> {
    try {
      await call('POST', `${user}/messages/${encodeURIComponent(draft.id)}/send`);
    } catch (err) {
      // Do not leave unsent drafts behind in the mailbox.
      await call('DELETE', `${user}/messages/${encodeURIComponent(draft.id)}`).catch(() => {});
      throw err;
    }
    return { messageId: draft.id, conversationId: draft.conversationId ?? null };
  }

  const recipient = (to: string) => [{ emailAddress: { address: to } }];

  return {
    mailbox: cfg.mailbox,

    async send(m) {
      const draft = await call<{ id: string; conversationId?: string }>('POST', `${user}/messages`, {
        subject: m.subject,
        body: { contentType: 'HTML', content: m.html },
        toRecipients: recipient(m.to),
      });
      return sendDraft(draft);
    },

    async reply(threadMessageId, m) {
      // createReply quotes the earlier email; our text goes above the quote.
      const draft = await call<{ id: string; conversationId?: string; body?: { content?: string } }>(
        'POST',
        `${user}/messages/${encodeURIComponent(threadMessageId)}/createReply`,
        { message: { toRecipients: recipient(m.to) } },
      );
      const quoted = draft.body?.content ?? '';
      const open = /<body[^>]*>/i.exec(quoted);
      const content = open
        ? quoted.slice(0, open.index + open[0].length) + m.fragment + '<br>' + quoted.slice(open.index + open[0].length)
        : m.html;
      await call('PATCH', `${user}/messages/${encodeURIComponent(draft.id)}`, {
        body: { contentType: 'HTML', content },
        toRecipients: recipient(m.to),
        ...(m.subject ? { subject: m.subject } : {}),
      }).catch(async (err) => {
        await call('DELETE', `${user}/messages/${encodeURIComponent(draft.id)}`).catch(() => {});
        throw err;
      });
      return sendDraft(draft);
    },

    async received(since, maxPages = 10) {
      const params = new URLSearchParams({
        $filter: `receivedDateTime ge ${since.toISOString()}`,
        $orderby: 'receivedDateTime asc',
        $select: 'from,subject,conversationId,receivedDateTime',
        $top: '100',
      });
      let url: string | undefined = `${user}/messages?${params}`;
      const messages: Inbound[] = [];
      for (let page = 0; url && page < maxPages; page++) {
        const body: {
          value: { from?: { emailAddress?: { address?: string } }; subject?: string; conversationId?: string; receivedDateTime: string }[];
          '@odata.nextLink'?: string;
        } = await call('GET', url);
        for (const m of body.value) {
          messages.push({
            from: (m.from?.emailAddress?.address ?? '').toLowerCase(),
            subject: m.subject ?? '',
            conversationId: m.conversationId ?? null,
            receivedAt: new Date(m.receivedDateTime),
          });
        }
        url = body['@odata.nextLink'];
      }
      return { messages, more: Boolean(url) };
    },

    async check() {
      await call('GET', `${user}/mailFolders/inbox?$select=totalItemCount`);
    },
  };
}

export function mailerFromEnv(): Mailer | null {
  const cfg = graphConfigFromEnv();
  return cfg ? graphMailer(cfg) : null;
}
