// Relays one browser WebSocket to Burst's /ws, adding the verified identity
// headers on the upstream handshake. Messages the browser sends before the
// upstream connection opens are queued, and either side closing closes the other.

import WebSocket, { type RawData } from 'ws';

const MAX_QUEUED = 64;

// Close codes a peer may send in a close frame (1005, 1006 and 1015 are
// reserved for reporting and must not be sent).
function sendableCode(code: number): number {
  return code === 1000 || (code >= 1001 && code <= 1014 && code !== 1005 && code !== 1006) || (code >= 3000 && code <= 4999)
    ? code
    : 1000;
}

export function bridge(client: WebSocket, upstreamUrl: string | URL, headers: Record<string, string>): WebSocket {
  const upstream = new WebSocket(upstreamUrl, { headers, perMessageDeflate: false });
  const queue: { data: RawData; binary: boolean }[] = [];
  let closed = false;

  const closeBoth = (code = 1000, reason = '') => {
    if (closed) return;
    closed = true;
    const c = sendableCode(code);
    const r = reason.slice(0, 120);
    for (const ws of [client, upstream]) {
      if (ws.readyState === WebSocket.OPEN) ws.close(c, r);
      else if (ws.readyState === WebSocket.CONNECTING) ws.terminate();
    }
  };

  client.on('message', (data, binary) => {
    if (upstream.readyState === WebSocket.OPEN) upstream.send(data, { binary });
    else if (queue.length < MAX_QUEUED) queue.push({ data, binary });
    else closeBoth(1008, 'too many messages before connection');
  });

  upstream.on('open', () => {
    for (const m of queue.splice(0)) upstream.send(m.data, { binary: m.binary });
  });
  upstream.on('message', (data, binary) => {
    if (client.readyState === WebSocket.OPEN) client.send(data, { binary });
  });

  // Burst refused the handshake (e.g. it rejected the identity): tell the
  // browser to back off rather than hang.
  upstream.on('unexpected-response', (_req, res) => closeBoth(res.statusCode === 401 ? 4401 : 1011, 'upstream refused'));
  upstream.on('error', () => closeBoth(1011, 'upstream error'));
  client.on('error', () => closeBoth(1011));
  upstream.on('close', (code, reason) => closeBoth(code, reason.toString()));
  client.on('close', (code, reason) => closeBoth(code, reason.toString()));

  return upstream;
}
