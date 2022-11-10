import { describe, expect, test } from "@jest/globals";
import Parser from "./Parser";
import Lexer from "../lexer/Lexer";
import Source from "../lexer/Source";

const exec = (source: string) =>
	new Parser(new Lexer(new Source(source))).getRoot().evaluate();

describe("Integer Math", () => {

	test("Basic binary operators", () => {
		expect(exec("1 + 2")).toBe(3);
		expect(exec("5 * 10")).toBe(50);
		expect(exec("39 - 139")).toBe(-100);
		expect(exec("9 / 3")).toBe(3);
		expect(exec("9 % 2")).toBe(1);
	});

	test("Operator precedence", () => {
		expect(exec("(1 + 2) * 3")).toBe(9);
		expect(exec("1 + 2 * 3")).toBe(7);
		expect(exec("1 * 2 + 3")).toBe(5);
		expect(exec("1 * (2 + 3)")).toBe(5);
		expect(exec("9 / 3 * (2 + 4 - 5)")).toBe(3);
		expect(exec("36 / (3 * 2) + 4 - 5")).toBe(5);
	});

	test("Unary operators", () => {
		expect(exec("+ 2")).toBe(2);
		expect(exec("+2")).toBe(2);
		expect(exec("-23")).toBe(-23);
		expect(exec("- 23")).toBe(-23);
		expect(exec("1 + -36")).toBe(-35);
		expect(exec("1+-36")).toBe(-35);
	});
});
describe("Syntax Errors", () => {
	test("Syntax errors", () => {
		expect(() => exec("2 %")).toThrowErrorMatchingSnapshot();
		expect(() => exec("1 + 3 +")).toThrowErrorMatchingSnapshot();
		expect(() => exec("1 + 3 ^")).toThrowErrorMatchingSnapshot();
	});
});
