import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { before, describe, test } from 'node:test';
import { WebSocket, WebSocketServer } from 'ws';
import {
  createSessionValue,
  hashPassword,
  loadAccounts,
  readSession,
  signIn,
  verifyPassword,
  type Account,
} from '../lib/auth.ts';
import { forwardHeaders, identityHeaders, isSameOrigin } from '../lib/burst.ts';
import { bridge } from '../lib/ws-bridge.ts';

process.env.SESSION_SECRET = 'x'.repeat(48);

let jane: Account;
before(async () => {
  jane = { email: 'jane@symnexus.co', name: 'Jane Doe', role: 'member', password: await hashPassword('a strong passphrase') };
  process.env.TEAM_ACCOUNTS = JSON.stringify([jane]);
});

describe('passwords and accounts', () => {
  test('scrypt hash verifies only the right password', async () => {
    assert.equal(await verifyPassword('a strong passphrase', jane.password), true);
    assert.equal(await verifyPassword('a strong passphrasf', jane.password), false);
  });

  test('accounts are parsed and normalised', () => {
    const accounts = loadAccounts(JSON.stringify([{ email: ' Bob@SymNexus.co ', name: 'Bob', role: 'admin', password: jane.password }]));
    assert.equal(accounts.get('bob@symnexus.co')?.role, 'admin');
    assert.throws(() => loadAccounts('[{"email":"x@y.z","password":"plaintext"}]'));
  });

  test('sign-in: right password, wrong password, unknown email', async () => {
    assert.equal((await signIn('JANE@symnexus.co', 'a strong passphrase', 'ip1')).ok, true);
    const wrong = await signIn('jane@symnexus.co', 'nope nope nope', 'ip1');
    const unknown = await signIn('nobody@symnexus.co', 'nope nope nope', 'ip1');
    assert.equal(wrong.ok, false);
    assert.deepEqual(wrong, unknown); // same message whether or not the account exists
  });

  test('sign-in is throttled after repeated failures', async () => {
    let last;
    for (let i = 0; i < 9; i++) last = await signIn('jane@symnexus.co', 'wrong password!!', 'ip2');
    assert.equal(last?.ok, false);
    assert.match(last && !last.ok ? last.error : '', /Too many/);
  });
});

describe('session cookie', () => {
  test('round-trips for a current account', () => {
    const value = createSessionValue(jane);
    assert.deepEqual(readSession(value), { email: 'jane@symnexus.co', name: 'Jane Doe', role: 'member' });
  });

  test("spark-admin's fixed cookie value is not accepted", () => {
    assert.equal(readSession('spark_admin_authenticated_v1'), null);
  });

  test('rejects tampering, expiry, removed accounts and changed passwords', async () => {
    const value = createSessionValue(jane);
    const [payload, sig] = value.split('.');
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), e: 'boss@symnexus.co' })).toString('base64url');
    assert.equal(readSession(`${forged}.${sig}`), null, 'edited payload');
    assert.equal(readSession(value, Date.now() + 8 * 24 * 3600 * 1000), null, 'expired');

    const saved = process.env.TEAM_ACCOUNTS;
    process.env.TEAM_ACCOUNTS = '[]';
    assert.equal(readSession(value), null, 'account removed');
    process.env.TEAM_ACCOUNTS = JSON.stringify([{ ...jane, password: await hashPassword('a different passphrase') }]);
    assert.equal(readSession(value), null, 'password changed');
    process.env.TEAM_ACCOUNTS = saved;
  });
});

describe('Burst headers', () => {
  test('client identity headers and credentials are dropped; verified identity added', () => {
    const incoming = new Headers({
      'x-auth-consumer': 'sx:evil',
      'X-Auth-Consumer-Groups': 'admin',
      authorization: 'Bearer x',
      cookie: 'symnexus_team_session=abc',
      accept: 'application/json',
    });
    const out = forwardHeaders(incoming, { email: 'jane@symnexus.co', name: 'Jane Doe', role: 'member' });
    assert.equal(out.get('x-auth-consumer'), 'sx:jane@symnexus.co');
    assert.equal(out.get('x-auth-consumer-groups'), 'member');
    assert.equal(out.get('authorization'), null);
    assert.equal(out.get('cookie'), null);
    assert.equal(out.get('accept'), 'application/json');
    assert.equal(forwardHeaders(incoming, null).get('x-auth-consumer'), null);
  });

  test('identity claims', () => {
    const h = identityHeaders({ email: 'jane.doe@symnexus.co', name: 'Jane Doe', role: 'admin' });
    assert.deepEqual(JSON.parse(h['x-auth-claims']), { name: 'Jane Doe', email: 'jane.doe@symnexus.co', preferred_username: 'jane.doe' });
  });

  test('same-origin check', () => {
    const req = (origin?: string) => new Request('https://team.example/api/x', { headers: { host: 'team.example', ...(origin ? { origin } : {}) } });
    assert.equal(isSameOrigin(req('https://team.example')), true);
    assert.equal(isSameOrigin(req('https://evil.example')), false);
    assert.equal(isSameOrigin(req()), true);
  });
});

describe('WebSocket bridge', () => {
  test('relays both ways with identity headers, and closes upstream when the client leaves', async () => {
    // Fake Burst: echoes, records the handshake headers.
    let upstreamHeaders: Record<string, string | string[] | undefined> = {};
    let upstreamClosed!: () => void;
    const upstreamClosedP = new Promise<void>((r) => (upstreamClosed = r));
    const burst = new WebSocketServer({ port: 0 });
    burst.on('connection', (ws, req) => {
      upstreamHeaders = req.headers;
      ws.on('message', (d) => ws.send(`echo:${d}`));
      ws.on('close', () => upstreamClosed());
    });
    await new Promise((r) => burst.on('listening', r));
    const burstPort = (burst.address() as { port: number }).port;

    // Stand-in for the Vercel upgrade: a local server hands each client socket to bridge().
    const http = createServer();
    const front = new WebSocketServer({ server: http });
    front.on('connection', (client) =>
      bridge(client, `ws://127.0.0.1:${burstPort}/ws`, identityHeaders({ email: 'jane@symnexus.co', name: 'Jane', role: 'member' })),
    );
    await new Promise<void>((r) => http.listen(0, '127.0.0.1', r));
    const frontPort = (http.address() as { port: number }).port;

    const client = new WebSocket(`ws://127.0.0.1:${frontPort}/ws`);
    // Sent immediately, before the upstream handshake completes: must be queued, not lost.
    client.on('open', () => client.send('hello'));
    const reply = await new Promise<string>((r) => client.once('message', (d) => r(String(d))));
    assert.equal(reply, 'echo:hello');
    assert.equal(upstreamHeaders['x-auth-consumer'], 'sx:jane@symnexus.co');

    client.close();
    await upstreamClosedP;

    await new Promise((r) => burst.close(r));
    front.close();
    await new Promise((r) => http.close(r));
  });
});
