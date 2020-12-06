'use strict';

var assert = require('assert');
var bytes = require('..');

describe('Test byte format function', function(){
  var pb = Math.pow(1000, 5);
  var tb = Math.pow(1000, 4);
  var gb = Math.pow(1000, 3);
  var mb = Math.pow(1000, 2);
  var kb = Math.pow(1000, 1);

  var pib = Math.pow(1024, 5);
  var tib = Math.pow(1024, 4);
  var gib = Math.pow(1024, 3);
  var mib = Math.pow(1024, 2);
  var kib = Math.pow(1024, 1);

  it('Should return null if input is invalid', function(){
    assert.strictEqual(bytes.format(undefined), null);
    assert.strictEqual(bytes.format(null), null);
    assert.strictEqual(bytes.format(true), null);
    assert.strictEqual(bytes.format(false), null);
    assert.strictEqual(bytes.format(NaN), null);
    assert.strictEqual(bytes.format(Infinity), null);
    assert.strictEqual(bytes.format(''), null);
    assert.strictEqual(bytes.format('string'), null);
    assert.strictEqual(bytes.format(function(){}), null);
    assert.strictEqual(bytes.format({}), null);
  });

  it('Should convert numbers < 1 000 to `bytes` string', function(){
    assert.equal(bytes.format(0).toLowerCase(), '0b');
    assert.equal(bytes.format(100).toLowerCase(), '100b');
    assert.equal(bytes.format(-100).toLowerCase(), '-100b');
  });

  it('Should convert numbers >= 1 000 to kb string', function(){
    assert.equal(bytes.format(kb).toLowerCase(), '1kb');
    assert.equal(bytes.format(-kb).toLowerCase(), '-1kb');
    assert.equal(bytes.format(2 * kb).toLowerCase(), '2kb');
  });

  it('Should convert numbers >= 1 000 000 to mb string', function(){
    assert.equal(bytes.format(mb).toLowerCase(), '1mb');
    assert.equal(bytes.format(-mb).toLowerCase(), '-1mb');
    assert.equal(bytes.format(2 * mb).toLowerCase(), '2mb');
  });

  it('Should convert numbers >= 1000^3 to gb string', function(){
    assert.equal(bytes.format(gb).toLowerCase(), '1gb');
    assert.equal(bytes.format(-gb).toLowerCase(), '-1gb');
    assert.equal(bytes.format(2 * gb).toLowerCase(), '2gb');
  });

  it('Should convert numbers >= 1000^4 to tb string', function(){
    assert.equal(bytes.format(tb).toLowerCase(), '1tb');
    assert.equal(bytes.format(-tb).toLowerCase(), '-1tb');
    assert.equal(bytes.format(2 * tb).toLowerCase(), '2tb');
  });

  it('Should convert numbers >= 1 125 899 906 842 624 to pb string', function(){
    assert.equal(bytes.format(pb).toLowerCase(), '1pb');
    assert.equal(bytes.format(-pb).toLowerCase(), '-1pb');
    assert.equal(bytes.format(2 * pb).toLowerCase(), '2pb');
  });

  it('Should return standard case', function(){
    assert.equal(bytes.format(10), '10B');
    assert.equal(bytes.format(kb), '1kB');
    assert.equal(bytes.format(mb), '1MB');
    assert.equal(bytes.format(gb), '1GB');
    assert.equal(bytes.format(tb), '1TB');
    assert.equal(bytes.format(pb), '1PB');
  });

  it('Should support jedec mode', function(){
    assert.equal(bytes.format(2.2 * kib, {mode: 'jedec'}).toLowerCase(), '2.2kb');
    assert.equal(bytes.format(mib, {mode: 'jedec'}).toLowerCase(), '1mb');
    assert.equal(bytes.format(gib, {mode: 'jedec'}).toLowerCase(), '1gb');
    assert.equal(bytes.format(tib, {mode: 'jedec'}).toLowerCase(), '1tb');
    assert.equal(bytes.format(pib, {mode: 'jedec'}).toLowerCase(), '1024tb');
  });

  it('Should support metric mode', function(){
    assert.equal(bytes.format(gb, {mode: 'metric'}).toLowerCase(), '1gb');
    assert.equal(bytes.format(gb, {mode: 'metric'}).toLowerCase(), '1gb');
  });

  it('Should support decimal (alias for metric) mode', function(){
    assert.equal(bytes.format(gb, {mode: 'decimal'}).toLowerCase(), '1gb');
  });

  it('Should support binary mode', function(){
    assert.equal(bytes.format(kib, {mode: 'binary'}).toLowerCase(), '1kib');
    assert.equal(bytes.format(gib, {mode: 'binary'}).toLowerCase(), '1gib');
  });

  it('Should support using a specific unit', function(){
    assert.equal(bytes.format(2.2 * kb, {unit: 'B'}).toLowerCase(), '2200b');
    assert.equal(bytes.format(100 * kb, {unit: 'MB'}).toLowerCase(), '0.1mb');
    assert.equal(bytes.format(kib, {unit: 'B'}).toLowerCase(), '1024b');
    assert.equal(bytes.format(1024 * kb, {unit: 'kB'}).toLowerCase(), '1024kb');
  });

  it('Should error when given a bad unit', function(){
    assert.throws(
      function(){ bytes.format(12 * mib, {unit: ''}); },
      "not found"
    );
    assert.throws(
      function() { bytes.format(12 * mib, {unit: 'bb'}); },
      "not found"
    );
  })


  it('Should allow units to be case insensitive', function(){
    assert.equal(bytes.format(kib, {unit: 'b'}).toLowerCase(), '1024b');
    assert.equal(bytes.format(kib, {unit: 'B'}).toLowerCase(), '1024b');
    assert.equal(bytes.format(kb, {unit: 'kB'}).toLowerCase(), '1kb');
  });

  it('Should support using a specific unit in jedec mode', function(){
    assert.equal(bytes.format(1, {unit: 'b', mode:'jedec'}).toLowerCase(), '1b');
    assert.equal(bytes.format(kib, {unit: 'kb', mode:'jedec'}).toLowerCase(), '1kb');
    assert.equal(bytes.format(mib, {unit: 'mb', mode:'jedec'}).toLowerCase(), '1mb');
    assert.equal(bytes.format(gib, {unit: 'gb', mode:'jedec'}).toLowerCase(), '1gb');
    assert.equal(bytes.format(tib, {unit: 'tb', mode:'jedec'}).toLowerCase(), '1tb');
  });

  it('Should support other units in jedec mode', function(){
    assert.equal(bytes.format(kib, {unit: 'kib', mode:'jedec'}).toLowerCase(), '1kib');
    assert.equal(bytes.format(tib, {unit: 'tib', mode:'jedec'}).toLowerCase(), '1tib');
  });

  it('Support custom thousands separator', function(){
    assert.equal(bytes.format(1000, {mode: 'binary'}).toLowerCase(), '1000b');
    assert.equal(bytes.format(1000, {mode: 'binary', thousandsSeparator: ''}).toLowerCase(), '1000b');
    assert.equal(bytes.format(1000, {mode: 'binary', thousandsSeparator: null}).toLowerCase(), '1000b');
    assert.equal(bytes.format(1000, {mode: 'binary', thousandsSeparator: '.'}).toLowerCase(), '1.000b');
    assert.equal(bytes.format(1000, {mode: 'binary', thousandsSeparator: ','}).toLowerCase(), '1,000b');
    assert.equal(bytes.format(1000, {mode: 'binary', thousandsSeparator: ' '}).toLowerCase(), '1 000b');
  });

  it('Should custom unit separator', function(){
    assert.equal(bytes.format(kb), '1kB');
    assert.equal(bytes.format(kb, {unitSeparator: ''}), '1kB');
    assert.equal(bytes.format(kb, {unitSeparator: null}), '1kB');
    assert.equal(bytes.format(kb, {unitSeparator: ' '}), '1 kB');
    assert.equal(bytes.format(kb, {unitSeparator: '\t'}), '1\tkB');
  });

  it('Should support custom number of decimal places', function(){
    assert.equal(bytes.format(kb - 1, {decimalPlaces: 0}).toLowerCase(), '999b');
    assert.equal(bytes.format(kib, {decimalPlaces: 0}).toLowerCase(), '1kb');
    assert.equal(bytes.format(kb, {decimalPlaces: 0}).toLowerCase(), '1kb');
    assert.equal(bytes.format(1.4 * kb, {decimalPlaces: 0}).toLowerCase(), '1kb');
    assert.equal(bytes.format(1.5 * kb, {decimalPlaces: 0}).toLowerCase(), '2kb');

    assert.equal(bytes.format(kb - 1, {decimalPlaces: 1}).toLowerCase(), '999b');
    assert.equal(bytes.format(kib, {decimalPlaces: 1}).toLowerCase(), '1kb');
    assert.equal(bytes.format(kb, {decimalPlaces: 1}).toLowerCase(), '1kb');
    assert.equal(bytes.format(1.04 * kb, {decimalPlaces: 1}).toLowerCase(), '1kb');
    assert.equal(bytes.format(1.05 * kb, {decimalPlaces: 1}).toLowerCase(), '1.1kb');
  });

  it('Should support fixed decimal places', function(){
    assert.equal(bytes.format(kb, {decimalPlaces: 3, fixedDecimals: true}).toLowerCase(), '1.000kb');
  });

  it('Should support floats', function(){
    assert.equal(bytes.format(1.2 * mb).toLowerCase(), '1.2mb');
    assert.equal(bytes.format(-1.2 * mb).toLowerCase(), '-1.2mb');
    assert.equal(bytes.format(1.2 * kb).toLowerCase(), '1.2kb');
  })
});

