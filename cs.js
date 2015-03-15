/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// Rotate an integer with 'bits' bits left and right by 'n'.
function rol(cw, bits, n) {
  return ((cw << n) & ((1<<bits)-1)) | (cw >> (bits - n));
}

function ror(cw, bits, n) {
  return (cw >> n) | ((cw << (bits - n)) & ((1<<bits)-1));
}

module.exports = {
  rol: rol,
  ror: ror,
};
