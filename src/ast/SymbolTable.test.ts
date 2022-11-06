import { describe, expect, test } from "@jest/globals";
import SymbolTable, { SCOPE_TYPE } from "./SymbolTable";
import SourcePosition from "../lexer/SourcePosition";

describe("Symbol Table", () => {
	const x = { type: "int", value: 5 };
	const y = { type: "int", value: 12 };
	const z = { type: "string", value: "hello" };

	test("Declaring, getting, and setting values works within one stack", () => {
		const table = new SymbolTable();

		table.declare("x", x.type, x.value);
		expect(table.get("x")).toStrictEqual(x);
		table.declare("y", y.type, y.value);
		table.declare("z", z.type, z.value);
		expect(table.get("x")).toStrictEqual(x);
		expect(table.get("y")).toStrictEqual(y);
		expect(table.get("z")).toStrictEqual(z);
		table.update("x", 19);
		expect(table.get("x")).toStrictEqual({ type: x.type, value: 19 });
		expect(table.get("y")).toStrictEqual(y);
	});

	test("Redeclaring a variable in an outer stack only causes that scope's variable to be updated", () => {
		const table = new SymbolTable();
		table.declare("x", x.type, x.value);
		expect(table.get("x")).toStrictEqual(x);
		table.pushScope(
			"one()",
			SCOPE_TYPE.FUNCTION,
			new SourcePosition("", 0)
		);
		table.declare("x", "string", "goodbye");
		expect(table.get("x")).toStrictEqual({
			type: "string",
			value: "goodbye"
		});
		table.update("x", "hello");
		expect(table.get("x")).toStrictEqual({
			type: "string",
			value: "hello"
		});
		table.exitScope()
		expect(table.get("x")).toStrictEqual(x);


	})

	test("Variables in outer scopes are preserved, variables in inner scopes are removed.", () => {
		const table = new SymbolTable();

		table.declare("x", x.type, x.value);
		expect(table.get("x")).toStrictEqual(x);

		table.pushScope(
			"one()",
			SCOPE_TYPE.FUNCTION,
			new SourcePosition("", 0)
		);
		table.pushScope(
			"two()",
			SCOPE_TYPE.FUNCTION,
			new SourcePosition("", 0)
		);
		table.declare("y", y.type, y.value);
		expect(table.get("y")).toStrictEqual(y);
		table.pushScope(
			"three()",
			SCOPE_TYPE.FUNCTION,
			new SourcePosition("", 0)
		);
		table.declare("z", z.type, z.value);
		expect(table.get("x")).toStrictEqual(x);
		expect(table.has("y")).toBe(true);
		expect(table.get("y")).toStrictEqual(y);
		expect(table.get("z")).toStrictEqual(z);

		table.exitScope();
		expect(table.has("y")).toBe(true);
		expect(table.get("y")).toStrictEqual(y);
		expect(table.has("z")).toBe(false);

		table.exitScope();

		expect(table.has("y")).toBe(false);
		expect(table.has("z")).toBe(false);
		table.exitScope();

		expect(table.get("x")).toStrictEqual(x);
		expect(table.has("y")).toBe(false);
		expect(table.has("z")).toBe(false);
	});

	test("Errors are thrown in the correct places", () => {
		const table = new SymbolTable();
		expect(() => table.exitScope()).toThrowError();
		expect(table.has("x")).toBe(false);
		expect(() => table.get("x")).toThrowError();
		expect(() => table.update("x", 12)).toThrowError();
		table.declare("x", x.type, x.value)
		expect(() => table.declare("x", "string", "hello")).toThrowError();

	})
});
