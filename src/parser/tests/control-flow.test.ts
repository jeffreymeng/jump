import { describe, test, expect, jest, beforeAll } from "@jest/globals";
import type { MatcherFunction } from "expect";
import { exec, execOutput } from "./execLine";
import dedent from "dedent";
import SymbolTable from "../../ast/SymbolTable";
import { JumpSyntaxError } from "../../errors";

describe("Conditional statements", () => {
	test("Basic if statements", () => {
		expect(
			execOutput(`
			if (3 < 5) {
				print("yes");
			}
		`)
		).toStrictEqual(["yes"]);
	});

	test("Else block of if-else triggers", () => {
		expect(
			execOutput(`
			if (3 + 4 < 5) {
				print("yes");
			} else {
				print("no");
			}
		`)
		).toStrictEqual(["no"]);
	});

	test("Else if block of if-elseif-else triggers", () => {
		expect(
			execOutput(`
			if (3 + 4 < 5) {
				print("yes");
			} else if (3 % 2 == 1) {
				print("maybe");
			} else {
				print("no");
			}
		`)
		).toStrictEqual(["maybe"]);
	});

	test("Else block of if-elseif-else triggers", () => {
		expect(
			execOutput(`
			int x = 5;
			int y = 9;
			if (x > y) {
				print("yes");
			} else if (x - y > 0) {
				print("maybe");
			} else {
				print("no");
			}
		`)
		).toStrictEqual(["no"]);
	});

	test("If block of if-elseif-else triggers", () => {
		expect(
			execOutput(`
			int x = 5;
			int y = 9;
			if (x < y) {
				print("yes");
				print("yes again");
			} else if (x - y > 0) {
				print("maybe");
			} else {
				print("no");
			}
		`)
		).toStrictEqual(["yes", "yes again"]);
	});

	test("Rejects an if else block after an else block", () => {
		expect(() =>
			exec(`
			if (true) {
				print("hello");
			} else {
				print("goodbye");
			} else if (3 + 4 < 9) {
				print("waittt...");
			}
		`)
		).toThrow(JumpSyntaxError);
	});

	test("Rejects a floating else if block", () => {
		expect(() =>
			exec(`
			else if (false) {
				print("huh?");
			}
		`)
		).toThrow(JumpSyntaxError);
	});

	test("Rejects a else if after but not immediately after an if block", () => {
		expect(() =>
			exec(`
			if (9 < 10) {
				print("hi");
			}
			print("oops");
			else if (3 > 2) {
				print("huh?");
			}
		`)
		).toThrow(JumpSyntaxError);
	});

	test("Close over variables in the if block", () => {
		const symbolTable = new SymbolTable();
		expect(
			execOutput(
				`
			int x = 10;
			if (3 < 5) {
				int y = x / 2;
				x = x + y;
			}
			print(x);
		`,
				symbolTable
			)
		).toStrictEqual(["15"]);
		expect(symbolTable.has("x")).toBe(true);
		expect(symbolTable.has("y")).toBe(false);
	});

	test("Close over variables in the else block", () => {
		const symbolTable = new SymbolTable();
		expect(
			execOutput(
				`
			int x = 10;
			if (x > 10) {
				int z = 9;
			} else {
				int y = x;
				x = x + y;	
			}
			print(x);
		`,
				symbolTable
			)
		).toStrictEqual(["20"]);
		expect(symbolTable.has("x")).toBe(true);
		expect(symbolTable.has("y")).toBe(false);
		expect(symbolTable.has("z")).toBe(false);
	});
});

describe("While loops", () => {
	test("Don't start when the condition is false", () => {
		expect(
			execOutput(`
			int x = 10;
			while (x < 10) {
				print("hi");
			}
		`)
		).toStrictEqual([]);
	});

	test("Keep going until the condition is false", () => {
		expect(
			execOutput(`
			int x = 0;
			while (x < 3) {
				print("hi");
				x = x + 1;
			}
		`)
		).toStrictEqual(["hi", "hi", "hi"]);
	});

	test("Exit with a break statement", () => {
		expect(
			execOutput(`
			int x = 0;
			while (x < 3) {
				print("hi");
				if (x == 1) {
					break;
				}
			}
			print("done");
		`)
		).toStrictEqual(["hi", "hi", "done"]);
	});

	test("Skip with a continue statement", () => {
		expect(
			execOutput(`
			int x = 0;
			while (x < 5) {
				print(x);
				if (x == 1) {
					continue;
				}
			}
		`)
		).toStrictEqual(["0", "2", "3", "4"]);
	});

	test("Close over variables created inside them", () => {
		const symbolTable = new SymbolTable();
		expect(
			execOutput(
				`
			int x = 0;
			while (x < 3) {
				int y = 9;
				print(y * 2);
				x = x + 1;
			}
			print(x);
		`,
				symbolTable
			)
		).toStrictEqual(["18", "18", "18", "3"]);
		expect(symbolTable.has("x")).toBe(true);
		expect(symbolTable.has("y")).toBe(false);
	});
});
