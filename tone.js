/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var sintab = new (require('./sintab'))(512, -128, 127);

function step(freq, sampleRate) {
  return Math.round(sintab.length * freq / sampleRate);
}

function ToneGenerator(sampleRate, markFreq, spaceFreq) {
  this.markStep = step(markFreq, sampleRate);
  this.spaceStep = step(spaceFreq, sampleRate);
  this.phase = 0;
  this.step = this.spaceStep;
}

ToneGenerator.prototype = {
  // Get the next sample from the tone generator.
  nextSample: function () {
    this.phase += this.step;
    this.phase %= sintab.length;
    return sintab.lookup(this.phase);
  },
  // Pick the mark or space tone.
  setTone: function(bit) {
    this.step = bit ? this.markStep : this.spaceStep;
  },
};

module.exports = ToneGenerator;
