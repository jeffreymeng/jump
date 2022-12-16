import { expect, describe, test } from "@jest/globals";
import execLine from "./execLine";
import SymbolTable from "../../ast/SymbolTable";
import { IntNode } from "../../ast/nodes/LiteralNodes";
import { JumpNameError, JumpSyntaxError } from "../../errors";

describe("Variable Declaration", () => {
	test("Declaration with single constant value", () => {
		const st = new SymbolTable();
		execLine("int x = 3", st);
		execLine("int y = 9", st);

		expect(st.get("x")).toStrictEqual({
			type: "int",
			value: 3,
		});

		expect(st.get("y")).toStrictEqual({
			type: "int",
			value: 9,
		});
	});

	test("Reassigning values to declared variables", () => {
		const st = new SymbolTable();
		execLine("int x = 3", st);
		execLine("x = 5", st);

		expect(st.get("x").value).toBe(5);

		execLine("x = x + 1", st);
		expect(st.get("x").value).toBe(6);

		execLine("x = x + 1", st);
		expect(st.get("x").value).toBe(7);
	});

	test("Expressions with variables", () => {
		const st = new SymbolTable();
		execLine("int x = 3", st);
		execLine("int y = 9", st);

		expect(execLine("x", st)).toBe(3);
		expect(execLine("y", st)).toBe(9);
		expect(execLine("x + 3", st)).toBe(6);
		expect(execLine("x + y * 3", st)).toBe(30);
	});

	test("Relying on undeclared variables throws a NameError", () => {
		const st = new SymbolTable();
		expect(() => execLine("x", st)).toThrowError(JumpNameError);

		execLine("int x = 3", st);
		expect(execLine("x", st)).toBe(3);
		expect(() => execLine("3 + y", st)).toThrowError(JumpNameError);
	})
});
