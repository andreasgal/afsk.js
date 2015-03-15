/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// Polynomial long division for a value with 'bits' bits.
function pld(x, bits, poly) {
  for (var i = 0; i < bits; ++i) {
    if (x & 1)
      x ^= poly;
    x >>= 1;
  }
  return x;
}

function makeTable(bits, poly) {
  var tbl = [];
  for (var x = 0; x < (1 << bits); ++x)
    tbl.push(pld(x, bits, poly));
  return tbl;
}

module.exports = makeTable;
