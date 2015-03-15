/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var ToneGenerator = require('./tone').ToneGenerator;
var Scrambler = require('./scramble17').Scrambler;
var golay = require('./golay');

var bitRate = 1200;
var samplesPerBit = 8;
var sampleRate = bitRate * samplesPerBit;

// Bell 202 standard frequencies for 1200 baud: 1200Hz mark, 2200Hz space
var markFreq = 1200;
var spaceFreq = 2200;

// Preamble byte (01010101)
var preambleByte = 0x55;

function tx(bytes, fn) {
  var tone = new ToneGenerator(sampleRate, markFreq, spaceFreq);
  // We will scramble the bit stream with a 17 bit LFSR.
  var s = new Scrambler();

  // Scramble and send a bit.
  function sendBit(bit) {
    tone.setTone(s.encode(bit));
    for (var n = 0; n < samplesPerBit; ++n)
      fn(tone.nextSample());
  }

  // Send a 24 bit code word (MSB first).
  function sendCodeWord(cw) {
    for (var n = 0; n < 24; ++n) {
      sendBit((cw >> 23) & 1);
      cw <<= 1;
    }
  }

  // Send 3 bytes with golay encoding.
  function send3(a, b, c) {
    golay.encode3(a, b, c, function (p, q) {
      sendCodeWord(p);
      sendCodeWord(q);
    });
  }

  // Send sync preamble.
  function preamble(n) {
    while (n-- > 0)
      send3(preambleByte, preambleByte, preambleByte);
  }

  // Send preamble, 0-padded data bytes, and short preamble to end frame.
  preamble(10);
  for (var n = 0; n < bytes.length; n += 3)
    send3(bytes[n], bytes[n+1]|0, bytes[n+2]|0);
  preamble(2);
}

// send 100 0s
var input = [];
for (var n = 0; n < 100; ++n)
  input.push(0);
var data = [];
tx(input, function (sample) {
  data.push(sample/128-1);
});

var baudio = require('baudio');
var b = baudio({rate:9600}, function (t, n) {
  return data[n];
});
b.play();
