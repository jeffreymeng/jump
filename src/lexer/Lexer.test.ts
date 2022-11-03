import { describe, expect, test } from "@jest/globals";

import Lexer from "./Lexer";
import Source from "./Source";
import Token, { TOKEN_TYPE } from "./Token";

describe("Lexer", () => {
	// curried
	const t = (type: TOKEN_TYPE) => (symbol: string) => new Token(type, symbol);
	const int = t(TOKEN_TYPE.INT_LITERAL);
	const str = t(TOKEN_TYPE.STRING_LITERAL);
	const op = t(TOKEN_TYPE.OPERATOR);
	const id = t(TOKEN_TYPE.IDENTIFIER);
	const ctrl = t(TOKEN_TYPE.CONTROL);
	const kw = t(TOKEN_TYPE.KEYWORD);
	const semi = () => ctrl(";");
	const nl = () => ctrl("\n");
	// lexes the string and returns an array of tokens.
	const lexToArray = (s: string) => [...new Lexer(new Source(s))];
	test("Basic Lexing", () => {
		expect(lexToArray(`"hello" 2 0.2 42.294 "23.1"`)).toEqual([
			str("hello"),
			int("2"),
			t(TOKEN_TYPE.DOUBLE_LITERAL)("0.2"),
			t(TOKEN_TYPE.DOUBLE_LITERAL)("42.294"),
			str("23.1"),
		]);
	});

	test("Operators", () => {
		expect(lexToArray(`i ++ i *= 5 ** 5 i **= 5 i && x i <= x i || y`)).toEqual([
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
			id("y")
		])
	})

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

		expect(lexToArray(s)).toEqual(expected);
	});

	// test("Error cases", () => {
	// 	expect(lexToArray(``))
	// })
});
