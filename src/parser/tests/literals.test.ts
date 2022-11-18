import { describe, test, expect } from "@jest/globals";
import exec from "./exec";

describe("Basic Literals", () => {
	test("Integer Literals", () => {
		expect(exec("0")).toBe(0);
		expect(exec("1")).toBe(1);
		expect(exec("9")).toBe(9);
		expect(exec("17")).toBe(17);
		expect(exec("184921")).toBe(184921);
	});

	test("Double Literals", () => {
		expect(exec("0.0")).toBe(0);
		expect(exec("1.0")).toBe(1);
		expect(exec("9.7333")).toBe(9.7333);
		expect(exec("17.4")).toBe(17.4);
	});

	test("Integer & Double Literals With Unary Negation For Negative Numbers", () => {
		expect(exec("-0")).toBe(0);
		expect(exec("-47")).toBe(-47);
		expect(exec("-1")).toBe(-1);
		expect(exec("-0.0")).toBe(0);
		expect(exec("-47.23")).toBe(-47.23);
		expect(exec("-1.5")).toBe(-1.5);
	});

	test("String Literals", () => {
		expect(exec(`"Hello, World!"`)).toBe("Hello, World!");
		expect(exec(`"1"`)).toBe("1");
		expect(exec(`""`)).toBe("");
		expect(exec(`"132.32"`)).toBe("132.32");
		expect(exec(`''`)).toBe("");
		expect(exec(`'Foo'`)).toBe("Foo");
		expect(exec(`'"'`)).toBe(`"`)
	});

	test("Boolean Literals", () => {
		expect(exec(`true`)).toBe(true);
		expect(exec(`false`)).toBe(false);
	});
});
