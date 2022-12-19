import {
	describe,
	expect,
	test,
	jest,
	beforeAll,
	afterAll,
} from "@jest/globals";
import { MockInstance } from "jest-mock";
import execLine, { execOutput } from "./execLine";
import SymbolTable from "../../ast/SymbolTable";
import { JumpTypeError } from "../../errors";

describe("Built in functions", () => {
	test("print() with no arguments calls native print() with no arguments", () => {
		expect(execOutput(`print();`)).toStrictEqual([""]);
	});
	test("print() works with constant values", () => {
		expect(execOutput(`print(3);`)).toStrictEqual(["3"]);
		expect(execOutput(`print(39);`)).toStrictEqual(["39"]);
		expect(execOutput(`print(8, 10, 482);`)).toStrictEqual(["8 10 482"]);
	});

	test("print() works with expressions", () => {
		expect(execOutput(`print(3 + 9);`)).toStrictEqual(["12"]);
		expect(execOutput(`print(3 ** 2 + 1);`)).toStrictEqual(["10"]);
		expect(execOutput(`print(2, 3 * 7, (5 + 8) * 2);`)).toStrictEqual([
			"2 21 26",
		]);
	});

	test("min() and max() work with constant values", () => {
		expect(execLine(`min(3, 9)`)).toBe(3);
		expect(execLine(`max(3, 9)`)).toBe(9);

		expect(execLine(`min(21, 17, 104)`)).toBe(17);
		expect(execLine(`max(21, 17, 104)`)).toBe(104);

		expect(execLine(`min(-3, -1)`)).toBe(-3);
		expect(execLine(`max(-3, -1)`)).toBe(-1);

		expect(execLine(`min(100)`)).toBe(100);
		expect(execLine(`max(100)`)).toBe(100);

		expect(execLine(`min(0, 10)`)).toBe(0);
		expect(execLine(`max(0, 10)`)).toBe(10);
	});

	test("min() and max() work with basic math expressions", () => {
		expect(execLine(`min(3 * 7, 9)`)).toBe(9);
		expect(execLine(`max(3 * 7, 9)`)).toBe(21);

		expect(execLine(`min(1 + 2 + 12, (2 * 8) + 1)`)).toBe(15);
		expect(execLine(`max(1 + 2 + 12, (2 * 8) + 1)`)).toBe(17);
	});

	test("min() and max() work with expressions including nested function calls", () => {
		expect(execLine(`min(5, max(3, 10))`)).toBe(5);
		expect(execLine(`min(0, min(6, 10))`)).toBe(0);
		expect(execLine(`max(1, 3, min(5 * 2, 100))`)).toBe(10);
	});

	test("min() and max() work with variables", () => {
		const symbols = new SymbolTable();
		execLine(`int x = 3`, symbols);
		expect(execLine(`min(x, 10)`, symbols)).toBe(3);
		expect(execLine(`max(x, 10)`, symbols)).toBe(10);

		execLine(`int y = 19`, symbols);
		expect(execLine(`min(x, y)`, symbols)).toBe(3);
		expect(execLine(`max(x, y)`, symbols)).toBe(19);
	});

	test("min() and max() throw errors when passed incorrect types", () => {
		expect(() => execLine(`min("hi")`)).toThrowError(JumpTypeError);
		expect(() => execLine(`max("hi")`)).toThrowError(JumpTypeError);

		expect(() => execLine(`min(19, "foo")`)).toThrowError(JumpTypeError);
		expect(() => execLine(`max(19, "foo")`)).toThrowError(JumpTypeError);
	});
});
