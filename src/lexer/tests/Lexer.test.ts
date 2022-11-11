import { describe, expect, test } from "@jest/globals";

import Lexer from "../Lexer";
import Source from "../Source";
import Token, { TokenType } from "../Token";
import SourcePosition from "../SourcePosition";
import { JumpSyntaxError } from "../../errors";

describe("Lexer", () => {
	// curried
	const t = (type: TokenType) => (symbol: string) =>
		new Token(type, symbol, new SourcePosition("", 0));
	const int = t(TokenType.INT_LITERAL);
	const str = t(TokenType.STRING_LITERAL);
	const op = t(TokenType.OPERATOR);
	const id = t(TokenType.IDENTIFIER);
	const ctrl = t(TokenType.CONTROL);
	const kw = t(TokenType.KEYWORD);
	const semi = () => ctrl(";");
	const nl = () => ctrl("\n");
	// lexes the string and returns an array of tokens.
	const lexToArray = (s: string): Token[] => [...new Lexer(new Source(s))];
	const lexToArrayMatches = (s: string, expected: Token[]): boolean =>
		lexToArray(s).every((x, i) => x.equals(expected[i]));

	test("Basic Lexing", () => {
		expect(
			lexToArrayMatches(`"hello" 2 0.2 42.294 "23.1"`, [
				str("hello"),
				int("2"),
				t(TokenType.DOUBLE_LITERAL)("0.2"),
				t(TokenType.DOUBLE_LITERAL)("42.294"),
				str("23.1"),
			])
		).toBe(true);
	});

	test("Operators", () => {
		expect(
			lexToArrayMatches(
				`i ++ i *= 5 ** 5 i **= 5 i && x i <= x i || y !=`,
				[
					id("i"),
					op("++"),
					id("i"),
					op("*="),
					int("5"),
					op("**"),
					int("5"),
					id("i"),
					op("**="),
					int("5"),
					id("i"),
					op("&&"),
					id("x"),
					id("i"),
					op("<="),
					id("x"),
					id("i"),
					op("||"),
					id("y"),
					op("!="),
				]
			)
		).toBe(true);
	});

	test("Example", () => {
		const s = `
int[] nums = [1, 2, 3, 4, 5, 9];

for (i in nums.filter(n => n % 2 == 0)) {
	print(i ** 2);
}\n`;

		const expected = [
			nl(),
			id("int"),
			op("["),
			op("]"),
			id("nums"),
			op("="),
			op("["),
			...[1, 2, 3, 4, 5, 9].map((x, i) =>
				i !== 0 ? [op(","), int(x + "")] : [int(x + "")]
			),
			op("]"),
			semi(),
			nl(),
			nl(),
			kw("for"),
			op("("),
			id("i"),
			kw("in"),
			id("nums"),
			op("."),
			id("filter"),
			op("("),
			id("n"),
			op("=>"),
			id("n"),
			op("%"),
			int("2"),
			op("=="),
			int("0"),
			op(")"),
			op(")"),
			ctrl("{"),
			nl(),
			id("print"),
			op("("),
			id("i"),
			op("**"),
			int("2"),
			op(")"),
			semi(),
			nl(),
			ctrl("}"),
			// the lexer does not pass trailing newlines.
		].flat();

		expect(lexToArrayMatches(s, expected)).toBe(true);
	});

	test("Literals", () => {
		expect(lexToArrayMatches(`123.`, [int("123"), op(".")])).toBe(true);
		expect(() => lexToArray(`"hello'`)).toThrowErrorMatchingSnapshot();
		expect(() => lexToArray(`'`)).toThrowErrorMatchingSnapshot();
		expect(lexToArrayMatches(`""'''"'`, [str(""), str(""), str(`"`)])).toBe(
			true
		);
		expect(() => lexToArray(`"'"'`)).toThrowErrorMatchingSnapshot("");
		expect(
			lexToArrayMatches(`8h4i4()`, [
				int("8"),
				id("h4i4"),
				op("("),
				op(")"),
			])
		).toBe(true);
	});

	test("Error cases", () => {
		expect(() => new Lexer(new Source("😎")).next()).toThrow(
			JumpSyntaxError
		);
	});

	test("Clone", () => {
		const lex = new Lexer(new Source("1 2 3"));
		expect(lex.nextToken().is(TokenType.INT_LITERAL, "1")).toBe(true);
		expect(lex.nextToken().is(TokenType.INT_LITERAL, "2")).toBe(true);
		expect(lex.clone().nextToken().is(TokenType.INT_LITERAL, "1")).toBe(
			true
		);
	});
});
