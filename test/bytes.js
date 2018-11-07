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
    assert.equal(bytes('1kB'), 1024);
  });

  it('Should convert a number into a string', function(){
    // This function is testes more accurately in another test suite
    assert.equal(bytes(1024), '1kB');
  });

  it('Should convert a number into a string with options', function(){
    // This function is tested more accurately in another test suite
    assert.equal(bytes(1000, {thousandsSeparator: ' ', unit: "b"}), '1 000B');
    assert.equal(bytes(1024, {unitSeparator: '---'}), '1---kB');
  });
});

describe('Test withDefaultMode', function(){
  var compatibility = bytes.withDefaultMode('compatibility');
  var binary = bytes.withDefaultMode('binary');

  it('Expect a function', function(){
    assert.equal(typeof compatibility, 'function');
  });

  it('Shoud still be able to parse a string into a number', function(){
    assert.equal(compatibility('1kB'), 1024);
  });

  it('Shoud still accept other modes', function(){
    assert.equal(compatibility('1kB', {mode: 'metric'}), 1000);
  });


  it('Should still convert a number into a string', function(){
    assert.equal(compatibility(1024), '1kB');
  });

  it('Should run parse properly', function(){
    assert.equal(compatibility.parse('1kB'), 1024);
  });

  it('Should run format properly', function(){
    assert.equal(compatibility.format(1024), '1kB');
  });

  it('Should not affect older modules', function(){
    assert.equal(bytes.format(1024), '1kB');
    assert.equal(binary.format(1024), '1KiB');
  });
});

