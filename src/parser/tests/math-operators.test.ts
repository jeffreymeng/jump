import { describe, expect, test } from "@jest/globals";
import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import { JumpDivisionByZeroError, JumpSyntaxError } from "../../errors";
import execLine from "./execLine";


describe("Integer Math", () => {
	test("Basic binary operators", () => {
		expect(execLine("1 + 2")).toBe(3);
		expect(execLine("5 * 10")).toBe(50);
		expect(execLine("39 - 139")).toBe(-100);
		expect(execLine("9 / 3")).toBe(3);
		expect(execLine("9 % 2")).toBe(1);
	});

	test("Operator precedence", () => {
		expect(execLine("(1 + 2) * 3")).toBe(9);
		expect(execLine("1 + 2 * 3")).toBe(7);
		expect(execLine("1 * 2 + 3")).toBe(5);
		expect(execLine("1 * (2 + 3)")).toBe(5);
		expect(execLine("9 / 3 * (2 + 4 - 5)")).toBe(3);
		expect(execLine("36 / (3 * 2) + 4 - 5")).toBe(5);
	});

	test("Left Associative Operators", () => {
		expect(execLine("5 - 2 - 2")).toBe(1);
		expect(execLine("5 + 2 - 2 + 4")).toBe(9);
		expect(execLine("9 / 4 * 8 / 9")).toBe(2);
	});

	test("Right Associative Operators (exponentiation)", () => {
		expect(execLine("2 ** 3 ** 2")).toBe(512);
	});

	test("Division By Zero", () => {
		// expect JumpDivisionByZeroError or something like that
		// not a js error
		expect(() => execLine("1 / 0")).toThrowError(JumpDivisionByZeroError);
		expect(() => execLine("(1 - 1) / (9 / 3 - 3)")).toThrowError(
			JumpDivisionByZeroError
		);
	});

	test("Unary operators", () => {
		expect(execLine("+ 2")).toBe(2);
		expect(execLine("+2")).toBe(2);
		expect(execLine("-23")).toBe(-23);
		expect(execLine("- 23")).toBe(-23);
		expect(execLine("1 + -36")).toBe(-35);
		expect(execLine("1+-36")).toBe(-35);
	});
});

describe("Double Math", () => {
	test("Basic double operations", () => {
		expect(execLine("1 + 2.5")).toBeCloseTo(3.5);
		expect(execLine("5.9 + 6.11")).toBeCloseTo(12.01);
		expect(execLine("9 / 2")).toBeCloseTo(4.5);
	});
});
