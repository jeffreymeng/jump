import { describe, expect, test } from "@jest/globals";
import { JumpSyntaxError } from "../../errors";
import execLine from "./execLine";
import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import { TokenType } from "../../lexer/Token";

class TestableParser extends Parser {
	public next(assertType?: TokenType, assertSymbol?: string) {
		if (assertType && assertSymbol) {
			return super.next(assertType, assertSymbol);
		} else if (assertType) {
			return super.next(assertType);
		} else {
			return super.next();
		}
	}
	public peek(n?: number) {
		return super.peek(n);
	}
	public peekMatches(type: TokenType, symbol?: string | string[]) {
		if (symbol) {
			return super.peekMatches(type, symbol);
		} else {
			return super.peekMatches(type);
		}
	}
}

describe("Internal next/peek/peekMatches", () => {
	test("Next", () => {
		const p = new TestableParser(new Lexer(new Source("1 2 3")));
		expect(p.next().is(TokenType.INT_LITERAL, "1")).toBe(true);
		expect(p.next().is(TokenType.INT_LITERAL, "2")).toBe(true);
	});

	test("Next Error Cases", () => {
		const p = new TestableParser(new Lexer(new Source("1 2 3")));
		expect(() => p.next(TokenType.INT_LITERAL, "1")).not.toThrow();
		expect(() =>
			p.next(TokenType.INT_LITERAL, "1")
		).toThrowErrorMatchingSnapshot();
		p.next();
		p.next();
		expect(() => p.next()).toThrowErrorMatchingSnapshot();
	});

	test("Peek", () => {
		const p = new TestableParser(new Lexer(new Source("1 2 3")));
		expect(p.peek()?.is(TokenType.INT_LITERAL, "1")).toBe(true);
		expect(p.peek()?.is(TokenType.INT_LITERAL, "1")).toBe(true);

		p.next();

		expect(p.peek()?.is(TokenType.INT_LITERAL, "2")).toBe(true);
		expect(p.peek(2)?.is(TokenType.INT_LITERAL, "3")).toBe(true);
		expect(p.peek()?.is(TokenType.INT_LITERAL, "2")).toBe(true);

		p.next(TokenType.INT_LITERAL, "2");
	});

	test("PeekMatches", () => {
		const p = new TestableParser(new Lexer(new Source("1 'hi'")));
		expect(p.peekMatches(TokenType.INT_LITERAL, "1")).toBe(true);
		expect(p.peekMatches(TokenType.INT_LITERAL, "2")).toBe(false);
		expect(p.peekMatches(TokenType.STRING_LITERAL)).toBe(false);
		expect(p.peekMatches(TokenType.STRING_LITERAL, "1")).toBe(false);

		p.next();
		expect(p.peekMatches(TokenType.INT_LITERAL, "1")).toBe(false);
		expect(p.peekMatches(TokenType.STRING_LITERAL, "hi")).toBe(true);

		p.next();
		expect(p.peekMatches(TokenType.STRING_LITERAL, "hi")).toBe(false);
	});

	test("PeekMatches with array", () => {
		const p = new TestableParser(new Lexer(new Source("1 'hi'")));
		expect(p.peekMatches(TokenType.INT_LITERAL, [])).toBe(false);
		expect(p.peekMatches(TokenType.INT_LITERAL, ["1"])).toBe(true);
		expect(p.peekMatches(TokenType.INT_LITERAL, ["1", "2"])).toBe(true);
		expect(p.peekMatches(TokenType.INT_LITERAL, ["2", "3"])).toBe(false);
	});
});

describe("Parser Errors", () => {
	test("Syntax errors", () => {
		expect(() => execLine("2 %")).toThrowError(JumpSyntaxError);
		expect(() => execLine("1 + 3 +")).toThrowError(JumpSyntaxError);
		expect(() => execLine("1 + 3 3")).toThrowError(JumpSyntaxError);
		expect(() => execLine("1 1")).toThrowError(JumpSyntaxError);
		expect(() => execLine("1 + 3 ^")).toThrowError(JumpSyntaxError);
		expect(() => execLine("(")).toThrowError(JumpSyntaxError);
		expect(() => execLine("(()")).toThrowError(JumpSyntaxError);
		expect(() => execLine("(()")).toThrowError(JumpSyntaxError);
		expect(() => execLine("😎")).toThrowError(JumpSyntaxError);
		expect(() => execLine("")).toThrowError(JumpSyntaxError);
	});
});
