// /storage/{key}: file storage for Burst, backed by a private Vercel Blob store.
//
// Burst's "gateway" storage backend speaks this small protocol (PUT, GET and
// DELETE on /storage/{key}, authenticated by an X-Storage-Key header). Burst
// calls it server to server; browsers download attachments through /api, which
// checks the session.

import { del, get, put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorised(request: Request): boolean {
  const expected = process.env.BURST_STORAGE_GATEWAY_API_KEY ?? '';
  const given = request.headers.get('x-storage-key') ?? '';
  if (expected.length < 32 || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

async function blobPath(context: { params: Promise<{ key: string[] }> }): Promise<string | null> {
  const { key } = await context.params;
  const path = key.map((s) => decodeURIComponent(s)).join('/');
  if (!path || path.length > 900 || path.split('/').some((s) => s === '..' || s === '.' || s === '')) return null;
  return `burst/${path}`;
}

type Ctx = { params: Promise<{ key: string[] }> };

export async function PUT(request: Request, context: Ctx) {
  if (!authorised(request)) return new Response(null, { status: 401 });
  const path = await blobPath(context);
  if (!path || !request.body) return new Response(null, { status: 400 });
  await put(path, request.body, {
    access: 'private',
    contentType: request.headers.get('content-type') ?? 'application/octet-stream',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return new Response(null, { status: 204 });
}

export async function GET(request: Request, context: Ctx) {
  if (!authorised(request)) return new Response(null, { status: 401 });
  const path = await blobPath(context);
  if (!path) return new Response(null, { status: 400 });
  const result = await get(path, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) return new Response(null, { status: 404 });
  const headers = new Headers({ 'content-type': result.blob.contentType ?? 'application/octet-stream' });
  if (typeof result.blob.size === 'number') headers.set('content-length', String(result.blob.size));
  return new Response(result.stream, { status: 200, headers });
}

export async function DELETE(request: Request, context: Ctx) {
  if (!authorised(request)) return new Response(null, { status: 401 });
  const path = await blobPath(context);
  if (!path) return new Response(null, { status: 400 });
  await del(path);
  return new Response(null, { status: 204 });
}
