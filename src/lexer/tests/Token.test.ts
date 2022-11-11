import { describe, expect, test } from "@jest/globals";
import Token, { TokenType } from "../Token";
import SourcePosition from "../SourcePosition";

describe("Token", () => {
	const position = new SourcePosition("", 0);
	test("creating new token", () => {
		const t = new Token(TokenType.KEYWORD, "for", position);
		expect(t.type).toBe(TokenType.KEYWORD);
		expect(t.symbol).toBe("for");
	});

	test("equality", () => {
		const t = new Token(TokenType.KEYWORD, "for", position);
		const t2 = new Token(TokenType.CONTROL, "for", position);
		const t3 = new Token(TokenType.KEYWORD, "notfor", position);
		const t4 = new Token(TokenType.STRING_LITERAL, "adsf", position);
		const t5 = new Token(TokenType.KEYWORD, "for", position);

		expect(t.equals(t2)).toBe(false);
		expect(t.equals(t3)).toBe(false);
		expect(t.equals(t4)).toBe(false);
		expect(t.equals(t5)).toBe(true);
	});

	test("is", () => {
		const t = new Token(TokenType.KEYWORD, "for", position);

		expect(t.is(TokenType.KEYWORD, "for")).toBe(true);
		expect(t.is(TokenType.CONTROL, "for")).toBe(false);
		expect(t.is(TokenType.KEYWORD, "forr")).toBe(false);
	});

	test("toString", () => {
		const op = new Token(TokenType.OPERATOR, "+", position);
		const str = new Token(TokenType.STRING_LITERAL, "foo", position);
		const int = new Token(TokenType.INT_LITERAL, "5", position);

		expect(op.toString()).toMatchSnapshot();
		expect(int.toString()).toMatchSnapshot();
		expect(int.toString()).toMatchSnapshot();
	});
});
