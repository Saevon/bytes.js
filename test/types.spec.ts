import assert from "assert";
import bytes from "bytes-iec";

/*
this test is intended more to verify type definitions than functionality
*/

describe("Entrypoints", () => {
  it("is callable (`format`)", () => {
    assert.strictEqual(typeof bytes, "function");
  });

  it("has `format`, `parse`, and `withDefaultMode`", () => {
    assert.strictEqual(typeof bytes.format, "function");
    assert.strictEqual(typeof bytes.parse, "function");
    assert.strictEqual(typeof bytes.withDefaultMode, "function");
  });

  it("accepts all expected options to `format`", () => {
    const options: Required<Parameters<typeof bytes.format>[1]> = {
      decimalPlaces: 2,
      fixedDecimals: true,
      mode: "binary",
      thousandsSeparator: "",
      unit: "kiB",
      unitSeparator: ""
    };
    const formatted = bytes.format(1024, options);

    assert.strictEqual(formatted, "1.00KiB");
  });

  it("accepts all expected options to `parse`", () => {
    const options: Required<Parameters<typeof bytes.parse>[1]> = {
      mode: "binary"
    };
    const parsed = bytes.parse("1KiB", options);

    assert.strictEqual(parsed, 1024);
  });

  it("accepts all expected options to `withDefaultMode`", () => {
    const parsed = bytes.withDefaultMode("compatibility").parse("1KB");

    assert.strictEqual(parsed, 1024);
  });
});
