/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var golay = require('../golay.js');

exports.test = function (test) {
    test.expect(1);
    var ok = true;
    for (var a = 0; a < 256; a++) {
	for (var b = 0; b < 256; b++) {
	    for (var c = 0; c < 256; c++) {
		golay.encode3(a, b, c, function (p, q, r, s, t, u) {
		  golay.decode3(p, q, r, s, t, u, function (x, y, z) {
		    if (a != x || b != y || c != z)
                      match = false;
		  });
		});
	    }
	}
    }
    test.ok(ok);
    test.done();
}