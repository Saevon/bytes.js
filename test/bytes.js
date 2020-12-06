'use strict';

var assert = require('assert');
var bytes = require('../index.js');

describe('Test constructor', function(){
  it('Expect a function', function(){
    assert.equal(typeof bytes, 'function');
  });

  it('Should return null if input is invalid', function(){
    assert.strictEqual(bytes(undefined), null);
    assert.strictEqual(bytes(null), null);
    assert.strictEqual(bytes(true), null);
    assert.strictEqual(bytes(false), null);
    assert.strictEqual(bytes(NaN), null);
    assert.strictEqual(bytes(function(){}), null);
    assert.strictEqual(bytes({}), null);
  });
  it('Shoud be able to parse a string into a number', function(){
    // This function is testes more accurately in another test suite
    assert.equal(bytes('1kB'), 1000);
  });

  it('Should convert a number into a string', function(){
    // This function is testes more accurately in another test suite
    assert.equal(bytes(1000), '1kB');
  });

  it('Should convert a number into a string with options', function(){
    // This function is tested more accurately in another test suite
    assert.equal(bytes(1000, {thousandsSeparator: ' ', unit: "b"}), '1 000B');
    assert.equal(bytes(1000, {unitSeparator: '---'}), '1---kB');
  });
});

describe('Test withDefaultMode', function(){
  var jedec = bytes.withDefaultMode('jedec');
  var binary = bytes.withDefaultMode('binary');
  var metric = bytes.withDefaultMode('metric');

  it('Expect a function', function(){
    assert.equal(typeof jedec, 'function');
  });

  it('Should still be able to parse a string into a number', function(){
    assert.equal(jedec('1kB'), 1024);
  });

  it('Should still accept other modes', function(){
    assert.equal(jedec('1kB', {mode: 'metric'}), 1000);
  });

  it('Should still convert a number into a string', function(){
    assert.equal(jedec(1024), '1kB');
  });

  it('Should run parse properly', function(){
    assert.equal(jedec.parse('1kB'), 1024);
  });

  it('Should run format properly', function(){
    assert.equal(jedec.format(1024), '1kB');
  });

  it('Should not affect older modules', function(){
    assert.equal(bytes.format(1024), '1.02kB');
    assert.equal(jedec.format(1024), '1kB');
    assert.equal(binary.format(1024), '1KiB');
    assert.equal(metric.format(1000), '1kB');
  });

  it('Allow aliases: compatibility', function(){
    var compatibility = bytes.withDefaultMode('compatibility');
    assert.equal(compatibility.format(1024), '1kB');
    assert.equal(compatibility.parse('1kB'), 1024);

    assert.equal(metric.parse('1kB', {mode: 'compatibility'}), 1024);
    assert.equal(metric.format(1024, {mode: 'compatibility'}), '1kB');
  });

  it('Allow aliases: decimal', function(){
    var decimal = bytes.withDefaultMode('decimal');
    assert.equal(decimal.parse('1KB'), 1000);
    assert.equal(decimal.format(1000), '1kB');

    assert.equal(binary.parse('1KB', {mode: 'decimal'}), 1000);
    assert.equal(binary.format(1000, {mode: 'decimal'}), '1kB');
  });

});



describe('Test bad modes', function(){
  it('should fail with unknown modes', function(){
    assert.throws(function() {
      bytes.withDefaultMode('unknown');
    }, Error, "bytes.js: invalid mode passed in: unknown");
    assert.throws(function() {
      bytes.parse('1kb', {mode: 'unknown'});
    }, Error, "bytes.js: invalid mode passed in: unknown");
    assert.throws(function()  {
      bytes.format(1, {mode: 'unknown'});
    }, Error, "bytes.js: invalid mode passed in: unknown");
  })
})




