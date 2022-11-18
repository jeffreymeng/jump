import {
	describe,
	expect,
	test,
	jest,
	beforeAll,
	afterAll,
} from "@jest/globals";
import { MockInstance } from "jest-mock";
import exec from "./exec";
import SymbolTable from "../../ast/SymbolTable";
import { JumpTypeError } from "../../errors";

describe("Built in functions", () => {
	let logSpy: MockInstance;
	beforeAll(() => {
		logSpy = jest.spyOn(console, "log").mockImplementation(() => {
			/* noop */
		});
	});

	test("print() with no arguments calls native print() with no arguments", () => {
		expect(exec(`print()`)).toBe(undefined);
		expect(logSpy.mock.calls[0].length).toBe(0);
	});
	test("print() works with constant values", () => {
		expect(exec(`print(3)`)).toBe(undefined);
		expect(exec(`print(39)`)).toBe(undefined);
		expect(exec(`print(8, 10, 482)`)).toBe(undefined);
		expect(logSpy).toHaveBeenNthCalledWith(1, 3);
		expect(logSpy).toHaveBeenNthCalledWith(2, 39);
		expect(logSpy).toHaveBeenNthCalledWith(3, 8, 10, 482);
	});

	test("print() works with expressions", () => {
		expect(exec(`print(3 + 9)`)).toBe(undefined);
		expect(exec(`print(3 ** 2 + 1)`)).toBe(undefined);
		expect(exec(`print(2, 3 * 7, (5 + 8) * 2)`)).toBe(undefined);
		expect(logSpy).toHaveBeenNthCalledWith(1, 12);
		expect(logSpy).toHaveBeenNthCalledWith(2, 10);
		expect(logSpy).toHaveBeenNthCalledWith(3, 2, 21, 26);
	});

	test("min() and max() work with constant values", () => {
		expect(exec(`min(3, 9)`)).toBe(3);
		expect(exec(`max(3, 9)`)).toBe(9);

		expect(exec(`min(21, 17, 104)`)).toBe(17);
		expect(exec(`max(21, 17, 104)`)).toBe(104);

		expect(exec(`min(-3, -1)`)).toBe(-3);
		expect(exec(`max(-3, -1)`)).toBe(-1);

		expect(exec(`min(100)`)).toBe(100);
		expect(exec(`max(100)`)).toBe(100);

		expect(exec(`min(0, 10)`)).toBe(0);
		expect(exec(`max(0, 10)`)).toBe(10);
	});

	test("min() and max() work with basic math expressions", () => {
		expect(exec(`min(3 * 7, 9)`)).toBe(9);
		expect(exec(`max(3 * 7, 9)`)).toBe(21);

		expect(exec(`min(1 + 2 + 12, (2 * 8) + 1)`)).toBe(15);
		expect(exec(`max(1 + 2 + 12, (2 * 8) + 1)`)).toBe(17);
	});

	test("min() and max() work with expressions including nested function calls", () => {
		expect(exec(`min(5, max(3, 10))`)).toBe(5);
		expect(exec(`min(0, min(6, 10))`)).toBe(0);
		expect(exec(`max(1, 3, min(5 * 2, 100))`)).toBe(10);
	});

	test("min() and max() work with variables", () => {
		const symbols = new SymbolTable();
		exec(`int x = 3`, symbols);
		expect(exec(`min(x, 10)`, symbols)).toBe(3);
		expect(exec(`max(x, 10)`, symbols)).toBe(10);

		exec(`int y = 19`, symbols);
		expect(exec(`min(x, y)`, symbols)).toBe(3);
		expect(exec(`max(x, y)`, symbols)).toBe(19);
	});

	test("min() and max() throw errors when passed incorrect types", () => {
		expect(() => exec(`min("hi")`)).toThrowError(JumpTypeError);
		expect(() => exec(`max("hi")`)).toThrowError(JumpTypeError);

		expect(() => exec(`min(19, "foo")`)).toThrowError(JumpTypeError);
		expect(() => exec(`max(19, "foo")`)).toThrowError(JumpTypeError);
	});

	afterAll(() => {
		logSpy.mockRestore();
	});
});
