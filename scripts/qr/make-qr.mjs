// Generates a styled QR code as a standalone SVG.
//
//   node scripts/qr/make-qr.mjs <url> <output.svg>
//   node scripts/qr/make-qr.mjs https://symnexus.co/contact public/assets/images/qr-contact.svg
//
// Encoding is Project Nayuki's QR Code generator and the styling is
// public/assets/js/qr/qr-svg.js, the same code the /qr page runs in the browser.

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const qrSvg = createRequire(import.meta.url)('../../public/assets/js/qr/qr-svg.js');

const [url, outFile] = process.argv.slice(2);
if (!url || !outFile) {
  console.error('Usage: node scripts/qr/make-qr.mjs <url> <output.svg>');
  process.exit(1);
}

const r = qrSvg(url);
writeFileSync(outFile, r.svg);
console.log(`QR version ${r.version} (${r.size}x${r.size} modules, ECC ${r.ecc}, mask ${r.mask}): ${r.dots} dots, ${r.aligns} alignment marker(s) -> ${outFile}`);
