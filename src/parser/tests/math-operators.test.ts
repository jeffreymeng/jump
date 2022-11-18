import { describe, expect, test } from "@jest/globals";
import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import { JumpDivisionByZeroError, JumpSyntaxError } from "../../errors";
import exec from "./exec";


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

	test("Left Associative Operators", () => {
		expect(exec("5 - 2 - 2")).toBe(1);
		expect(exec("5 + 2 - 2 + 4")).toBe(9);
		expect(exec("9 / 4 * 8 / 9")).toBe(2);
	});

	test("Right Associative Operators (exponentiation)", () => {
		expect(exec("2 ** 3 ** 2")).toBe(512);
	});

	test("Division By Zero", () => {
		// expect JumpDivisionByZeroError or something like that
		// not a js error
		expect(() => exec("1 / 0")).toThrowError(JumpDivisionByZeroError);
		expect(() => exec("(1 - 1) / (9 / 3 - 3)")).toThrowError(
			JumpDivisionByZeroError
		);
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

describe("Double Math", () => {
	test("Basic double operations", () => {
		expect(exec("1 + 2.5")).toBeCloseTo(3.5);
		expect(exec("5.9 + 6.11")).toBeCloseTo(12.01);
		expect(exec("9 / 2")).toBeCloseTo(4.5);
	});
});
