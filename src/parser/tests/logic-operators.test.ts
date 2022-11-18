import { describe, test, expect } from "@jest/globals";
import exec from "./exec";

describe("Basic Logic Operators", () => {
	test("Equality works, checking type and value", () => {
		expect(exec("3 == 3")).toBe(true);
		expect(exec("3 == 2")).toBe(false);
	});

	test("Negation operator on boolean literals", () => {
		expect(exec("!true")).toBe(false);
		expect(exec("!!true")).toBe(true);
		expect(exec("!false")).toBe(true);
	});

	test("Logical 'and' and 'or' operators", () => {
		expect(exec("true && false")).toBe(false);
		expect(exec("false && true")).toBe(false);
		expect(exec("false && false")).toBe(false);
		expect(exec("true && true")).toBe(true);

		expect(exec("true || false")).toBe(true);
		expect(exec("false || true")).toBe(true);
		expect(exec("false || false")).toBe(false);
		expect(exec("true || true")).toBe(true);
	});

	test("Equality on strings and numbers", () => {
		expect(exec(`"hi" == "hi"`)).toBe(true);
		expect(exec(`43 == 43`)).toBe(true);
		expect(exec(`43 == "43"`)).toBe(false);
		expect(exec(`43 != 43`)).toBe(false);
		expect(exec(`43 != "43"`)).toBe(true);
	});

	test("Comparison operators", () => {
		expect(exec("3 < 4")).toBe(true);
		expect(exec("3 <= 4")).toBe(true);
		expect(exec("3 > 4")).toBe(false);
		expect(exec("3 >= 4")).toBe(false);

		expect(exec("3 < 3")).toBe(false);
		expect(exec("3 <= 3")).toBe(true);
		expect(exec("3 > 3")).toBe(false);
		expect(exec("3 >= 3")).toBe(true);
	});
	test("Comparison with expressions", () => {
		expect(exec("3 + 1 == 4")).toBe(true);
		expect(exec("3 * 5 == 5")).toBe(false);
		expect(exec("3 + 1 < 4")).toBe(false);
		expect(exec("3 + 1 <= 4")).toBe(true);
		expect(exec("3 + 1 > 4")).toBe(false);
		expect(exec("3 + 1 >= 4")).toBe(true);

		expect(exec("3 * -1 < 0")).toBe(true);
		expect(exec("9 % 2 < 3")).toBe(true);
	});

	test("Or has precedence over And", () => {
		expect(exec("true || false && false || false")).toBe(false);
		expect(exec("true || (false && false) || false")).toBe(true);
	});

	test("Comparisons have precedence over or and and", () => {
		expect(exec(`3 < 4 && 8 < 5`)).toBe(false);
		expect(exec(`3 < 4 || 8 < 5`)).toBe(true);
	});

	test("Arithmetic has precedence over comparisons", () => {
		expect(exec(`3 + 1 < 4 && 3 + 1 + 4 > 12 * -1`)).toBe(false);
		expect(exec(`3 + 1 < 4 || 3 + 1 + 4 > 12 * -1`)).toBe(true);
	});
});
