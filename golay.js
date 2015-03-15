/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// Credit: Hank Wallace, http://www.aqdi.com/golay.htm

var morton = require('./morton');
var cs = require('./cs');
var pld = require('./pld')(12, 0xAE3);

// Calculate the [24, 12] Golay codeword for the given 12 input bits.
function golay(ib) {
  return (pld[ib]<<12) | ib;
}

// Calculate the parity for a 24 bit code word.
function parity(cw) {
    // Calculate the parity bit
    var p = cw ^ (cw >> 8) ^ (cw >> 16);
    return ((p>>4)^(p>>2)^(p>>1))&1;
}

// Golay codes are prone to burst errors so we interleave 2 adjacent
// code words. This actally also helps with streaming byte data through
// 12 bit codewords. The result are two 24 bit codewords.
function encode3(a, b, c, callback) {
  // Split 3 byets into 2 12-bit input bits.
  var ib1 = (a & 0xff) | ((b << 8) & 0xf00);
  var ib2 = ((b >> 4) & 0xf) | ((c << 4) & 0xff0);
  // Encode the 2 ibs to two 24-bit code words.
  var cw1 = golay(ib1);
  var cw2 = golay(ib2);
  // Add parity bit to each code word.
  cw1 |= parity(cw1) << 23;
  cw2 |= parity(cw2) << 23;
  // Interleave the low 16 bits of the code words (p) and the high 8 bit (q).
  var p = morton.interleave16(cw1 & 0xffff, cw2 & 0xffff);
  var q = morton.interleave16((cw1 >> 16) & 0xff, (cw2 >> 16) & 0xff);
  callback((p & 0xffff) | ((q << 16) & 0xff0000),
           ((p >> 16) & 0xffff) | ((q << 8) & 0xff0000));
}

// Calculate the number of bit errors in the code word.
function syndrome(cw) {
  return pld[cw] << 12;
}

var w = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];

// Calculate the weight of a 23 bit codeword.
function weight(cw) {
  return w[cw & 0xf] + w[(cw >> 4) & 0xf] + w[(cw >> 8) & 0xf] +
    w[(cw >> 12) & 0xf] + w[(cw >> 16) & 0xf] + w[(cw >> 20) & 0xf];
}

// Return a corrected code word for 3 or fewer errors. The number of
// errors corrected is in the topmost nibble.
function correct(cw) {
  var original = cw;
  var errs = 0;
  var w = 3; // initial syndrome weight threshold
  var mask = 1;
  for (var j = -1; j < 23; ++j) { // no flip first, then flip each trivial bit
    if (j != -1) {
      if (j > 0) {
        cw = original ^ mask;
        mask += mask; // point to next bit
      }
      cw = original ^ mask; // flip next trial bit
      w = 2; // lower the threshold
    }

    var s = syndrome(cw);
    if (!s) // we are done if there are no erros
      return cw | (errs << 28);

    for (i = 0; i < 23; ++i) { // check syndrome of each cyclic shift
      if ((errs = weight(s)) <= w) { // syndrome matches error pattern
        cw = cw ^ s; // remove error
        cw = cs.ror(cw, i); // unrotate data
        if (j >= 0) // count toggled bit
          errs++;
        return cw | (errs << 28);
      }
      cw = cs.rol(cw, 1); // rotate to next pattern
      s = syndrome(cw); // calculate new syndrome
    }
  }
  return original;
}

// Decode a single code word.
function decode(cw) {
  var p = cw & 0x800000; // save parity bit
  cw &= (~0x800000); // strip parity bit for correction
  cw = correct(cw);
  cw |= p; // restore parity bit
  return cw;
}

// Decode two interleaved code words and produce 3 bytes if we can
// recover the information.
function decode3(x, y, callback) {
  var p = (x & 0xffff) | ((y << 16) & 0xffff0000);
  var q = ((x >> 16) & 0xff) | ((y >> 8) & 0xff00);
  var cwh12 = morton.deinterleave16(q);
  var cwl12 = morton.deinterleave16(p);
  var cw1 = (cwl12 & 0xffff) | ((cwh12 & 0xff) << 16);
  var cw2 = ((cwl12 >> 16) & 0xffff) | (((cwh12 >> 16) & 0xff) << 16);
  cw1 = decode(cw1);
  cw2 = decode(cw2);
  // Keep track of the number of errors and remove error counter from code word
  var errs = Math.max(cw1 >> 28, cw2 >> 28);
  cw1 &= 0xffffff;
  cw2 &= 0xffffff;
  if (parity(cw1) || parity(cw2)) // odd parity is an error
    return false;
  callback(errs, cw1 & 0xff, ((cw1 >> 8) & 0xf) | ((cw2 & 0xf) << 4), (cw2 >> 4) & 0xff);
  return true;
}

module.exports = {
  encode3: encode3,
  decode3: decode3,
};
