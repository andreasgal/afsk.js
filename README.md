# afsk.js

afsk.js is a 1200 baud soft modem that uses Bell 202 AFSK tones, a
[24,12] Golay code for forward error correction and a 17 bit LFSR
scrambling register to debias the signal (similar to G3RUH's 9600 FSK
modem), instead of the more common NRZI.

afsk.js should be very resiliant to multi-bit errors and error bursts.
