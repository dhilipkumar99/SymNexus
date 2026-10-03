// Styled QR code as a standalone SVG string: round data dots in a blue
// gradient, rounded finder "eyes" and alignment markers, and the standard
// 4-module white quiet zone. Shared by the /qr page (browser, after
// qrcodegen.js) and scripts/qr/make-qr.mjs (Node).
//
//   qrSvg(text) -> { svg, style, version, size, ecc, mask, dots, aligns }
//
// Scannability comes first. Short text (up to version 13, ~170 characters)
// gets the full styling at error-correction level H (~30% recoverable), which
// leaves headroom for the round dots. Denser codes don't scan reliably with
// dots or the light end of the gradient, so longer text gets plain navy square
// modules at level M, up to version 26 (~1,000 characters). Beyond that a
// RangeError is thrown: such codes are too dense to scan dependably.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./qrcodegen.js'));
  else root.qrSvg = factory(root.qrcodegen);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (qrcodegen) {
  'use strict';

  // Palette: blue on white.
  var NAVY = '#0a2a66';
  var BLUE = '#1652d9';
  var AZURE = '#2f8ff0';
  var QUIET = 4;

  var STYLED_MAX_VERSION = 13;
  var MAX_VERSION = 26;
  function escapeXml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c];
    });
  }

  function encode(text) {
    var segs = qrcodegen.QrSegment.makeSegments(text);
    try {
      return { qr: qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.HIGH, 1, STYLED_MAX_VERSION, -1, true), style: 'dots' };
    } catch (err) {
      if (!(err instanceof RangeError)) throw err;
    }
    // Throws RangeError("Data too long") past MAX_VERSION.
    return { qr: qrcodegen.QrCode.encodeSegments(segs, qrcodegen.QrCode.Ecc.MEDIUM, 1, MAX_VERSION, -1, true), style: 'squares' };
  }

  function eccName(qr) {
    return ['L', 'M', 'Q', 'H'][qr.errorCorrectionLevel.ordinal];
  }

  // Alignment pattern centres for this version (same rule as the encoder), minus
  // the three that would collide with finder patterns.
  function alignmentCentres(version) {
    if (version === 1) return [];
    var count = Math.floor(version / 7) + 2;
    var step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
    var pos = [6];
    for (var p = version * 4 + 10; pos.length < count; p -= step) pos.splice(1, 0, p);
    var last = pos[pos.length - 1];
    var centres = [];
    pos.forEach(function (cx) {
      pos.forEach(function (cy) {
        var nearFinder = (cx === 6 && cy === 6) || (cx === 6 && cy === last) || (cx === last && cy === 6);
        if (!nearFinder) centres.push([cx, cy]);
      });
    });
    return centres;
  }

  function svgDocument(text, total, body) {
    var label = escapeXml(text);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total + '" width="1024" height="1024" role="img" aria-label="QR code for ' + label + '">\n' +
      '  <title>' + label + '</title>\n' + body + '</svg>\n';
  }

  // Dense codes: every dark module as a crisp navy square.
  function squaresSvg(text, qr) {
    var n = qr.size;
    var d = '';
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (qr.getModule(x, y)) d += 'M' + (x + QUIET) + ' ' + (y + QUIET) + 'h1v1h-1z';
      }
    }
    var total = n + QUIET * 2;
    return svgDocument(text, total,
      '  <rect width="' + total + '" height="' + total + '" fill="#ffffff"/>\n' +
      '  <path fill="' + NAVY + '" shape-rendering="crispEdges" d="' + d + '"/>\n');
  }

  return function qrSvg(text) {
    var encoded = encode(text);
    var qr = encoded.qr;
    var n = qr.size;
    var info = { style: encoded.style, version: qr.version, size: n, ecc: eccName(qr), mask: qr.mask };
    if (encoded.style === 'squares') {
      info.svg = squaresSvg(text, qr);
      info.dots = 0;
      info.aligns = 0;
      return info;
    }

    var total = n + QUIET * 2;
    var at = function (v) { return +(v + QUIET).toFixed(3); };

    // Finder patterns occupy the 7x7 squares in three corners.
    var finders = [[0, 0], [n - 7, 0], [0, n - 7]];
    var inFinder = function (x, y) {
      return finders.some(function (f) { return x >= f[0] && x < f[0] + 7 && y >= f[1] && y < f[1] + 7; });
    };
    var aligns = alignmentCentres(qr.version);
    var inAlign = function (x, y) {
      return aligns.some(function (c) { return Math.abs(x - c[0]) <= 2 && Math.abs(y - c[1]) <= 2; });
    };

    // Data and timing modules: round dots. Diameter 0.84 of a module keeps clear
    // gaps between dots while leaving plenty of dark area for scanners.
    var dots = [];
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (!qr.getModule(x, y) || inFinder(x, y) || inAlign(x, y)) continue;
        dots.push('<circle cx="' + at(x + 0.5) + '" cy="' + at(y + 0.5) + '" r="0.42"/>');
      }
    }

    // Finder eye: a 7x7 rounded ring (stroke 1 module) and a rounded 3x3 centre.
    var eye = function (f) {
      return '<rect x="' + at(f[0] + 0.5) + '" y="' + at(f[1] + 0.5) + '" width="6" height="6" rx="1.7" fill="none" stroke="' + NAVY + '" stroke-width="1"/>' +
        '<rect x="' + at(f[0] + 2) + '" y="' + at(f[1] + 2) + '" width="3" height="3" rx="0.9" fill="url(#qr-grad)"/>';
    };

    // Alignment marker: a 5x5 rounded ring and a centre dot.
    var align = function (c) {
      return '<rect x="' + at(c[0] - 1.5) + '" y="' + at(c[1] - 1.5) + '" width="4" height="4" rx="1.1" fill="none" stroke="' + NAVY + '" stroke-width="1"/>' +
        '<circle cx="' + at(c[0] + 0.5) + '" cy="' + at(c[1] + 0.5) + '" r="0.5" fill="' + NAVY + '"/>';
    };

    var stops = '<stop offset="0" stop-color="' + NAVY + '"/><stop offset="0.55" stop-color="' + BLUE + '"/><stop offset="1" stop-color="' + AZURE + '"/>';
    info.svg = svgDocument(text, total,
      '  <defs>\n' +
      '    <linearGradient id="qr-grad" x1="0" y1="0" x2="1" y2="1">' + stops + '</linearGradient>\n' +
      '    <linearGradient id="qr-dots" gradientUnits="userSpaceOnUse" x1="' + QUIET + '" y1="' + QUIET + '" x2="' + (QUIET + n) + '" y2="' + (QUIET + n) + '">' + stops + '</linearGradient>\n' +
      '  </defs>\n' +
      '  <rect width="' + total + '" height="' + total + '" fill="#ffffff"/>\n' +
      '  <g fill="url(#qr-dots)" shape-rendering="geometricPrecision">' + dots.join('') + '</g>\n' +
      '  ' + finders.map(eye).join('') + '\n' +
      '  ' + aligns.map(align).join('') + '\n');
    info.dots = dots.length;
    info.aligns = aligns.length;
    return info;
  };
});
