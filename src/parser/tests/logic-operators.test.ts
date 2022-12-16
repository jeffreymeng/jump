import { describe, test, expect } from "@jest/globals";
import execLine from "./execLine";

describe("Basic Logic Operators", () => {
	test("Equality works, checking type and value", () => {
		expect(execLine("3 == 3")).toBe(true);
		expect(execLine("3 == 2")).toBe(false);
	});

	test("Negation operator on boolean literals", () => {
		expect(execLine("!true")).toBe(false);
		expect(execLine("!!true")).toBe(true);
		expect(execLine("!false")).toBe(true);
	});

	test("Logical 'and' and 'or' operators", () => {
		expect(execLine("true && false")).toBe(false);
		expect(execLine("false && true")).toBe(false);
		expect(execLine("false && false")).toBe(false);
		expect(execLine("true && true")).toBe(true);

		expect(execLine("true || false")).toBe(true);
		expect(execLine("false || true")).toBe(true);
		expect(execLine("false || false")).toBe(false);
		expect(execLine("true || true")).toBe(true);
	});

	test("Equality on strings and numbers", () => {
		expect(execLine(`"hi" == "hi"`)).toBe(true);
		expect(execLine(`43 == 43`)).toBe(true);
		expect(execLine(`43 == "43"`)).toBe(false);
		expect(execLine(`43 != 43`)).toBe(false);
		expect(execLine(`43 != "43"`)).toBe(true);
	});

	test("Comparison operators", () => {
		expect(execLine("3 < 4")).toBe(true);
		expect(execLine("3 <= 4")).toBe(true);
		expect(execLine("3 > 4")).toBe(false);
		expect(execLine("3 >= 4")).toBe(false);

		expect(execLine("3 < 3")).toBe(false);
		expect(execLine("3 <= 3")).toBe(true);
		expect(execLine("3 > 3")).toBe(false);
		expect(execLine("3 >= 3")).toBe(true);
	});
	test("Comparison with expressions", () => {
		expect(execLine("3 + 1 == 4")).toBe(true);
		expect(execLine("3 * 5 == 5")).toBe(false);
		expect(execLine("3 + 1 < 4")).toBe(false);
		expect(execLine("3 + 1 <= 4")).toBe(true);
		expect(execLine("3 + 1 > 4")).toBe(false);
		expect(execLine("3 + 1 >= 4")).toBe(true);

		expect(execLine("3 * -1 < 0")).toBe(true);
		expect(execLine("9 % 2 < 3")).toBe(true);
	});

	test("Or has precedence over And", () => {
		expect(execLine("true || false && false || false")).toBe(false);
		expect(execLine("true || (false && false) || false")).toBe(true);
	});

	test("Comparisons have precedence over or and and", () => {
		expect(execLine(`3 < 4 && 8 < 5`)).toBe(false);
		expect(execLine(`3 < 4 || 8 < 5`)).toBe(true);
	});

	test("Arithmetic has precedence over comparisons", () => {
		expect(execLine(`3 + 1 < 4 && 3 + 1 + 4 > 12 * -1`)).toBe(false);
		expect(execLine(`3 + 1 < 4 || 3 + 1 + 4 > 12 * -1`)).toBe(true);
	});
});
