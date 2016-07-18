# Bytes utility

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
<!--
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
 -->
Utility to parse a string bytes (ex: `1TB`) to bytes (`1,000,000,000,000`) and vice-versa.

This uses the byte units defined in ISO/IEC 80000-13:2008, both the binary prefixes and the original SI units.

This is a fork of the [bytes][bytes] module, except:

 * It uses IEC units by default
 * Supports a wider range of units
 * Supports changing to compatability (JEDEC) mode, and formatting in whichever prefix type you prefix (binary, metric, compatibility)

## Supported Units

Supported units and abbreviations are as follows and are case-insensitive:

### Metric/Decimal Prefixes

|      Value       | Abbr |   Name    |
| ---------------- | ---- | --------- |
| 1                | B    | byte      |
| 1000<sup>1</sup> | kB   | kilobyte  |
| 1000<sup>2</sup> | MB   | megabyte  |
| 1000<sup>3</sup> | GB   | gigabyte  |
| 1000<sup>4</sup> | TB   | terabyte  |
| 1000<sup>5</sup> | PB   | petabyte  |
| 1000<sup>6</sup> | EB   | exabyte   |
| 1000<sup>7</sup> | ZB   | zettabyte |
| 1000<sup>8</sup> | YB   | yottabyte |


### Binary Prefixes:

|      Value       | Abbr |   Name    |
| ---------------- | ---- | --------- |
| 1                | B    | byte      |
| 1024<sup>1</sup> | KiB  | kibibyte  |
| 1024<sup>2</sup> | MiB  | mebibyte  |
| 1024<sup>3</sup> | GiB  | gibibyte  |
| 1024<sup>4</sup> | TiB  | tebibyte  |
| 1024<sup>5</sup> | PiB  | pebibyte  |
| 1024<sup>6</sup> | EiB  | exbibyte  |
| 1024<sup>7</sup> | ZiB  | zebibite  |
| 1024<sup>8</sup> | YiB  | yobibite  |


### Compatibility Binary Prefixes (JEDEC)

Overwrites the lower units of the metric system with the commonly misused prefixes

|      Value       | Abbr |   Name    |
| ---------------- | ---- | --------- |
| 1000<sup>1</sup> | kB   | kilobyte  |
| 1000<sup>2</sup> | MB   | megabyte  |
| 1000<sup>3</sup> | GB   | gigabyte  |
| 1000<sup>4</sup> | TB   | terabyte  |

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
npm install bytes-iec
```


## Usage

```js
var bytes = require('bytes');
```

#### bytes.format(number value, [options]): string|null

Format the given value in bytes into a string. If the value is negative, it is kept as such. If it is a float, it is
 rounded.

It supports the following output formats:

 * `binary`: uses the binary prefixes (KiB, MiB...)
 * `decimal`|`metric`: uses the metric system (decimal) prefixes (kB, MB...)
 * `compatibility`: uses the binary units, but the metric prefixes (kB == 1024B, MB...)

**Arguments**

| Name    | Type     | Description        |
|---------|----------|--------------------|
| value   | `number` | Value in bytes     |
| options | `Object` | Conversion options |

**Options**

| Property          | Type   | Description                                                                             |
|-------------------|--------|-----------------------------------------------------------------------------------------|
| decimalPlaces | `number`｜`null` | Maximum number of decimal places to include in output. Default value to `2`. |
| fixedDecimals | `boolean`｜`null` | Whether to always display the maximum number of decimal places. Default value to `false` |
| thousandsSeparator | `string`｜`null` | Example of values: `' '`, `','` and `.`... Default value to `''`. |
| unit | `string`｜`null` | The unit in which the result will be returned (B/KB/MB/GB/TB). Default value to `''` (which means auto detect). |
| unitSeparator | `string`｜`null` | Separator to use between number and unit. Default value to `''`. |
| mode         | `string`&124;`null` | Which format to output: `binary`, `metric`, `decimal`, `compatibility`. Default value is `metric` |

**Returns**

| Name    | Type             | Description                                     |
|---------|------------------|-------------------------------------------------|
| results | `string`｜`null` | Return null upon error. String value otherwise. |

**Example**

```js
bytes(1000);
// output: '1kB'

bytes(1000, {thousandsSeparator: ' '});
// output: '1 000B'

bytes(1024);
// output: '1.02kB'

bytes(1024 * 1.7, {decimalPlaces: 0});
// output: '2KB'

bytes(1000, {unitSeparator: ' '});
// output: '1 kB'

bytes(2048, {mode: 'binary'});
// output: '2 KiB'

bytes(1024 * 1024 * 2, {unit: 'KiB'});
// output: '2048 KiB'

bytes(1024 * 1024 * 2, {unit: 'KB'});
// output: '2097.152 KB'

bytes(1024 * 1024 * 2, {unit: 'KB', mode: 'compatibility'});
// output: '2048 KB'
```

#### bytes.parse(string｜number value): number｜null

Parse the string value into an integer in bytes. If no unit is given, or `value`
is a number, it is assumed the value is in bytes.

If the unit given has partial bytes, they are dropped (rounded down).


**Arguments**

| Name          | Type   | Description        |
|---------------|--------|--------------------|
| value   | `string`｜`number` | String to parse, or number in bytes.   |
| options | `Object` | Conversion options |


|       Property       |          Type         | Description |
| -------------------- | --------------------- | ----------- |
| mode   | `string`&#124;`null` | Which mode to use (see `bytes.format`) |

**Returns**

| Name    | Type        | Description             |
|---------|-------------|-------------------------|
| results | `number`｜`null` | Return null upon error. Value in bytes otherwise. |

**Example**

```js
bytes('1kB');
// output: 1024

bytes('1024');
// output: 1024

bytes('1.0001 kB');
// output: 1000
bytes('1.0001 KiB');
// output: 1024

bytes('1kB', {mode: compatibility});
// output: 1024
```


#### bytes.withDefaultMode(string mode): object

Returns a new module which acts like the `bytes` module, except with the given mode as the default.


**Arguments**

| Name          | Type     | Description        |
|---------------|----------|--------------------|
| mode          | `string` | Default mode to use   |

**Returns**

| Name    | Type        | Description             |
|---------|-------------|-------------------------|
| results | `object` | Returns the byte.js module, with a default mode |

**Example**

```js
var bytes = require('bytes').withDefaultMode('compatibility');

bytes('1kB');
// output: 1024

bytes('1KiB');
// output: 1024

bytes(1024);
// output: 1 kB

bytes(1024, {mode: 'metric'});
// output: 1.02kB

bytes('1kB', {mode: 'metric'});
// output: 1000
```


## License

[MIT](LICENSE)

<!--
[coveralls-image]: https://badgen.net/coveralls/c/github/visionmedia/bytes.js/master
[coveralls-url]: https://coveralls.io/r/visionmedia/bytes.js?branch=master
-->

[downloads-image]: https://badgen.net/npm/dm/bytes-iec
[downloads-url]: https://npmjs.org/package/bytes-iec
[npm-image]: https://badgen.net/npm/node/bytes-iec
[npm-url]: https://npmjs.org/package/bytes-iec
[bytes]: https://github.com/visionmedia/bytes.js

<!--
[travis-image]: https://badgen.net/travis/visionmedia/bytes.js/master
[travis-url]: https://travis-ci.org/visionmedia/bytes.js
-->
