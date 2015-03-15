/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

// Return a sinus table that can generate integer sinus values in the
// range [min,max] and the resolution [0,res]. The table has actually
// just res/4 entries since we can calculate the other phases from
// the table.
function SinusTable(sinusLength, min, max) {
  var tbl = [];
  min = min || 0;
  max = max || 255;
  var x = (max-min)/2;
  for (var n = 0; n < sinusLength/4; ++n)
    tbl.push(Math.round(Math.sin(n/(sinusLength/4)*Math.PI/2)*x+x));
  this.tbl = tbl;
  this.length = sinusLength;
}

SinusTable.prototype = {
  // Our table only covers the first quarter of the sinus wave. We
  // can flip the sign and mirror the curve to get the other quarters.
  lookup: function(x) {
    var len = this.length;
    var neg = (x >= len/2);
    x %= len/2; // this loses the sign
    if (x >= len/4)
      x = (len/2 - x - 1);
    var s = this.tbl[x];
    if (neg)
      s = 255 - s;
    return s;
  },
};

module.exports = SinusTable;
