/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var scramble17 = require('../scramble17.js');

var Scrambler = scramble17.Scrambler;
var Descrambler = scramble17.Descrambler;

exports.test = function (test) {
  test.expect(1);
  var e = new Scrambler(0x45678);
  var d = new Descrambler();
  var delta = 0;
  for (var n = 0; n < 100000; ++n) {
    var i = 0;
    var x = e.encode(i);
    var o = d.decode(x);
    if (i != o || e.shift != d.shift)
      ++delta;
  }
  test.ok(delta < 29);
  test.done();
};
