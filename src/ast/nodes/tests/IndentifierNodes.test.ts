import { describe, expect, test, jest, beforeAll } from "@jest/globals";
import {
	Identifier,
	TypeIdentifier,
	VariableAssignmentNode,
	VariableDeclarationNode,
	VariableNode,
} from "../IdentifierNodes";
import Token, { TokenType } from "../../../lexer/Token";
import SourcePosition from "../../../lexer/SourcePosition";
import { JumpInternalError } from "../../../errors";
import { IntNode } from "../LiteralNodes";
import SymbolTable from "../../SymbolTable";

jest.mock("../../SymbolTable");
const mockSymbolTable = jest.mocked(SymbolTable);

describe("Identifiers", () => {
	test("Basic identifier", () => {
		const i = new Identifier("foo");
		expect(i.name).toBe("foo");
	});
	test("Basic identifier from token", () => {
		const sp = new SourcePosition("", 0);
		const i = Identifier.fromToken(
			new Token(TokenType.IDENTIFIER, "bar", sp)
		);
		const i2 = Identifier.fromToken(
			new Token(TokenType.IDENTIFIER, "bar", sp)
		);
		expect(i).not.toBe(i2);
		expect(i).toStrictEqual(i2);
		expect(i.name).toBe("bar");
		expect(() =>
			Identifier.fromToken(new Token(TokenType.OPERATOR, "+", sp))
		).toThrow(JumpInternalError);
	});
});

describe("VariableDeclarationNode", () => {
	const node = new VariableDeclarationNode(
		new Identifier("foo"),
		new TypeIdentifier("bar"),
		new IntNode("3")
	);

	beforeAll(() => {
		mockSymbolTable.mockClear();
	});

	test("Declares a variable on the symbol table when evaluated", () => {
		node.evaluate(new SymbolTable());
		expect(mockSymbolTable.mock.instances[0].declare).toHaveBeenCalledWith(
			"foo",
			"bar",
			3
		);
	});

	test("Creates the same json when toJSON() is called", () => {
		expect(node.toJSON()).toMatchSnapshot();
	});
});

describe("VariableDeclarationNode", () => {
	const node = new VariableAssignmentNode(
		new Identifier("foo"),
		new IntNode("3")
	);

	beforeAll(() => {
		mockSymbolTable.mockClear();
	});

	test("Updates a variable on the symbol table when evaluated", () => {
		node.evaluate(new SymbolTable());
		expect(mockSymbolTable.mock.instances[0].update).toHaveBeenCalledWith(
			"foo",
			3
		);
	});

	test("Creates the same json when toJSON() is called", () => {
		expect(node.toJSON()).toMatchSnapshot();
	});
});

describe("VariableNode", () => {
	const node = new VariableNode(new Identifier("foo"));

	beforeAll(() => {
		mockSymbolTable.mockClear();
	});

	// TODO
	// test("Retrieves a variable from the symbol table when evaluated", () => {
	// 	mockSymbolTable.mockImplementation(() => ({
	// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 		// @ts-ignore
	// 		get: (id) => ({
	// 			type: "int",
	// 			value: 10,
	// 		}),
	// 	}));
	// 	expect(node.evaluate(new SymbolTable())).toBe(10);
	// 	expect(mockSymbolTable.mock.instances[0].get).toHaveBeenCalledWith(
	// 		"foo"
	// 	);
	// });

	test("Creates the same json when toJSON() is called", () => {
		expect(node.toJSON()).toMatchSnapshot();
	});
});
