import { expect, describe, test } from "@jest/globals";
import exec from "./exec";
import SymbolTable from "../../ast/SymbolTable";
import { IntNode } from "../../ast/nodes/LiteralNodes";
import { JumpSyntaxError } from "../../errors";

describe("Variable Declaration", () => {
	test("Declaration with single constant value", () => {
		const st = new SymbolTable();
		exec("int x = 3", st);
		exec("int y = 9", st);

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
		exec("int x = 3", st);
		exec("x = 5", st);

		expect(st.get("x").value).toBe(5);

		exec("x = x + 1", st);
		expect(st.get("x").value).toBe(6);

		exec("x = x + 1", st);
		expect(st.get("x").value).toBe(7);
	});

	test("Expressions with variables", () => {
		const st = new SymbolTable();
		exec("int x = 3", st);
		exec("int y = 9", st);

		expect(exec("x", st)).toBe(3);
		expect(exec("y", st)).toBe(9);
		expect(exec("x + 3", st)).toBe(6);
		expect(exec("x + y * 3", st)).toBe(30);
	});
});
