// Unit tests: no database needed.

import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { describe, test } from 'node:test';
import { WebSocket, WebSocketServer } from 'ws';
import { createSessionValue, hashPassword, verifyPassword, verifySessionCookie } from '../lib/auth.ts';
import { forwardHeaders, identityHeaders, isSameOrigin } from '../lib/burst.ts';
import type { Session } from '../lib/roles.ts';
import { bridge } from '../lib/ws-bridge.ts';

process.env.SESSION_SECRET = 'x'.repeat(48);

const jane: Session = { id: '0d3c6f0e-0000-4000-8000-000000000001', email: 'jane.doe@symnexus.co', name: 'Jane Doe', role: 'member' };

describe('passwords', () => {
  test('scrypt hash verifies only the right password', async () => {
    const h = await hashPassword('a strong passphrase');
    assert.equal(await verifyPassword('a strong passphrase', h), true);
    assert.equal(await verifyPassword('a strong passphrasf', h), false);
    assert.equal(await verifyPassword('anything', null), false);
  });
});

describe('session cookie', () => {
  test('round-trips id and version', () => {
    assert.deepEqual(verifySessionCookie(createSessionValue({ id: jane.id, session_version: 3 })), { id: jane.id, v: 3 });
  });

  test("rejects spark-admin's fixed value, tampering and expiry", () => {
    assert.equal(verifySessionCookie('spark_admin_authenticated_v1'), null);
    const value = createSessionValue({ id: jane.id, session_version: 1 });
    const [payload, sig] = value.split('.');
    const edited = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), v: 99 })).toString('base64url');
    assert.equal(verifySessionCookie(`${edited}.${sig}`), null);
    assert.equal(verifySessionCookie(value, Date.now() + 8 * 24 * 3600 * 1000), null);
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
    const out = forwardHeaders(incoming, jane);
    assert.equal(out.get('x-auth-consumer'), `sx:${jane.id}`);
    assert.equal(out.get('x-auth-consumer-groups'), 'member');
    assert.equal(out.get('authorization'), null);
    assert.equal(out.get('cookie'), null);
    assert.equal(out.get('accept'), 'application/json');
    assert.equal(forwardHeaders(incoming, null).get('x-auth-consumer'), null);
  });

  test('master admin and admins get Burst admin; claims carry name and email', () => {
    assert.equal(identityHeaders({ ...jane, role: 'owner' })['x-auth-consumer-groups'], 'admin');
    assert.equal(identityHeaders({ ...jane, role: 'admin' })['x-auth-consumer-groups'], 'admin');
    assert.deepEqual(JSON.parse(identityHeaders(jane)['x-auth-claims']), {
      name: 'Jane Doe',
      email: 'jane.doe@symnexus.co',
      preferred_username: 'jane.doe',
    });
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
    front.on('connection', (client) => bridge(client, `ws://127.0.0.1:${burstPort}/ws`, identityHeaders(jane)));
    await new Promise<void>((r) => http.listen(0, '127.0.0.1', r));
    const frontPort = (http.address() as { port: number }).port;

    const client = new WebSocket(`ws://127.0.0.1:${frontPort}/ws`);
    client.on('open', () => client.send('hello')); // before upstream opens: must be queued
    assert.equal(await new Promise<string>((r) => client.once('message', (d) => r(String(d)))), 'echo:hello');
    assert.equal(upstreamHeaders['x-auth-consumer'], `sx:${jane.id}`);

    client.close();
    await upstreamClosedP;
    await new Promise((r) => burst.close(r));
    front.close();
    await new Promise((r) => http.close(r));
  });
});
