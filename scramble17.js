/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// 17 bit scrambling register with taps at 12 and 17
function Scrambler(init) {
  this.shift = init|0;
}

Scrambler.prototype = {
  encode: function (bit) {
    bit = (bit ^ (this.shift >> 11) ^ (this.shift >> 16)) & 1;
    this.shift <<= 1;
    this.shift |= bit;
    return bit;
  },
};

function Descrambler(init) {
  this.shift = init|0;
}

Descrambler.prototype = {
  decode: function (bit) {
    this.shift <<= 1;
    this.shift |= bit;
    return (bit ^ (this.shift >> 12) ^ (this.shift >> 17)) & 1;
  },
};

module.exports = {
  Scrambler: Scrambler,
  Descrambler: Descrambler,
};
