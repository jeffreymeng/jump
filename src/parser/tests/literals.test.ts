import { describe, test, expect } from "@jest/globals";
import execLine from "./execLine";

describe("Basic Literals", () => {
	test("Integer Literals", () => {
		expect(execLine("0")).toBe(0);
		expect(execLine("1")).toBe(1);
		expect(execLine("9")).toBe(9);
		expect(execLine("17")).toBe(17);
		expect(execLine("184921")).toBe(184921);
	});

	test("Double Literals", () => {
		expect(execLine("0.0")).toBe(0);
		expect(execLine("1.0")).toBe(1);
		expect(execLine("9.7333")).toBe(9.7333);
		expect(execLine("17.4")).toBe(17.4);
	});

	test("Integer & Double Literals With Unary Negation For Negative Numbers", () => {
		expect(execLine("-0")).toBe(0);
		expect(execLine("-47")).toBe(-47);
		expect(execLine("-1")).toBe(-1);
		expect(execLine("-0.0")).toBe(0);
		expect(execLine("-47.23")).toBe(-47.23);
		expect(execLine("-1.5")).toBe(-1.5);
	});

	test("String Literals", () => {
		expect(execLine(`"Hello, World!"`)).toBe("Hello, World!");
		expect(execLine(`"1"`)).toBe("1");
		expect(execLine(`""`)).toBe("");
		expect(execLine(`"132.32"`)).toBe("132.32");
		expect(execLine(`''`)).toBe("");
		expect(execLine(`'Foo'`)).toBe("Foo");
		expect(execLine(`'"'`)).toBe(`"`)
	});

	test("Boolean Literals", () => {
		expect(execLine(`true`)).toBe(true);
		expect(execLine(`false`)).toBe(false);
	});
});
