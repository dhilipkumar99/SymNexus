// Generates a styled QR code as a standalone SVG.
//
//   node scripts/qr/make-qr.mjs <url> <output.svg>
//   node scripts/qr/make-qr.mjs https://symnexus.co/contact public/assets/images/qr-contact.svg
//
// Encoding is Project Nayuki's QR Code generator (scripts/qr/qrcodegen.cjs) at
// error-correction level H (~30% recoverable), which leaves headroom for the
// styling: round data dots in a blue gradient, rounded finder "eyes" and
// alignment markers, and the standard 4-module white quiet zone.

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const qrcodegen = createRequire(import.meta.url)('./qrcodegen.cjs');

const [url, outFile] = process.argv.slice(2);
if (!url || !outFile) {
  console.error('Usage: node scripts/qr/make-qr.mjs <url> <output.svg>');
  process.exit(1);
}

const qr = qrcodegen.QrCode.encodeText(url, qrcodegen.QrCode.Ecc.HIGH);
const n = qr.size;
const QUIET = 4;
const total = n + QUIET * 2;
const at = (v) => +(v + QUIET).toFixed(3);

// Palette: blue on white.
const NAVY = '#0a2a66';
const BLUE = '#1652d9';
const AZURE = '#2f8ff0';

// Finder patterns occupy the 7x7 squares in three corners.
const finders = [
  [0, 0],
  [n - 7, 0],
  [0, n - 7],
];
const inFinder = (x, y) => finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

// Alignment pattern centres for this version (same rule as the encoder), minus
// the three that would collide with finder patterns.
function alignmentCentres(version) {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const pos = [6];
  for (let p = version * 4 + 10; pos.length < count; p -= step) pos.splice(1, 0, p);
  const centres = [];
  for (const cx of pos) {
    for (const cy of pos) {
      const nearFinder = (cx === 6 && cy === 6) || (cx === 6 && cy === pos.at(-1)) || (cx === pos.at(-1) && cy === 6);
      if (!nearFinder) centres.push([cx, cy]);
    }
  }
  return centres;
}
const aligns = alignmentCentres(qr.version);
const inAlign = (x, y) => aligns.some(([cx, cy]) => Math.abs(x - cx) <= 2 && Math.abs(y - cy) <= 2);

// Data and timing modules: round dots. Diameter 0.84 of a module keeps clear
// gaps between dots while leaving plenty of dark area for scanners.
const dots = [];
for (let y = 0; y < n; y++) {
  for (let x = 0; x < n; x++) {
    if (!qr.getModule(x, y) || inFinder(x, y) || inAlign(x, y)) continue;
    dots.push(`<circle cx="${at(x + 0.5)}" cy="${at(y + 0.5)}" r="0.42"/>`);
  }
}

// Finder eye: a 7x7 rounded ring (stroke 1 module) and a rounded 3x3 centre.
const eye = ([fx, fy]) =>
  `<rect x="${at(fx + 0.5)}" y="${at(fy + 0.5)}" width="6" height="6" rx="1.7" fill="none" stroke="${NAVY}" stroke-width="1"/>` +
  `<rect x="${at(fx + 2)}" y="${at(fy + 2)}" width="3" height="3" rx="0.9" fill="url(#qr-grad)"/>`;

// Alignment marker: a 5x5 rounded ring and a centre dot.
const align = ([cx, cy]) =>
  `<rect x="${at(cx - 1.5)}" y="${at(cy - 1.5)}" width="4" height="4" rx="1.1" fill="none" stroke="${NAVY}" stroke-width="1"/>` +
  `<circle cx="${at(cx + 0.5)}" cy="${at(cy + 0.5)}" r="0.5" fill="${NAVY}"/>`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="1024" height="1024" shape-rendering="geometricPrecision" role="img" aria-label="QR code for ${url}">
  <title>${url}</title>
  <defs>
    <linearGradient id="qr-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.55" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${AZURE}"/>
    </linearGradient>
    <linearGradient id="qr-dots" gradientUnits="userSpaceOnUse" x1="${QUIET}" y1="${QUIET}" x2="${QUIET + n}" y2="${QUIET + n}">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.55" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${AZURE}"/>
    </linearGradient>
  </defs>
  <rect width="${total}" height="${total}" fill="#ffffff"/>
  <g fill="url(#qr-dots)">${dots.join('')}</g>
  ${finders.map(eye).join('')}
  ${aligns.map(align).join('')}
</svg>
`;

writeFileSync(outFile, svg);
console.log(`QR version ${qr.version} (${n}x${n} modules, ECC H, mask ${qr.mask}): ${dots.length} dots, ${aligns.length} alignment marker(s) -> ${outFile}`);
