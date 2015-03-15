/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var golay = require('../golay.js');

exports.test = function (test) {
    test.expect(1);
    var ok = true;
    for (var err = 0; err < 3; ++err) {
      for (var a = 0; a < 256; a++) {
        for (var b = 0; b < 256; b += 5) {
          for (var c = 0; c < 256; c += 3) {
            switch (err) {
            case 0:
              break;
            case 1:
              a ^= 1;
              break;
            case 1:
              a ^= 2;
              b ^= 4;
              break;
            case 2:
              a ^= 4;
              b ^= 8;
              c ^= 0x10;
              break;
            }
            golay.encode3(a, b, c, function (p, q, r, s, t, u) {
              golay.decode3(p, q, r, s, t, u, function (e, x, y, z) {
                if (e != err, a != x || b != y || c != z) {
                  console.log(a, b, c, x, y, z);
                  ok = false;
                }
              });
            });
          }
        }
      }
    }
    test.ok(ok);
    test.done();
}