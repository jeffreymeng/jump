import Token, { TokenType } from "./Token";
import SourcePosition from "./SourcePosition";
import Source from "./Source";
import { JumpSyntaxError } from "../errors";

export default class Lexer implements IterableIterator<Token> {
	/**
	 * The source code of the lexer.
	 */
	public readonly source: Source;

	/**
	 * The index of the current character within the source.
	 */
	protected index = 0;

	/**
	 * The index of the current token.
	 */
	protected currentTokenIndex = 0;

	constructor(source: Source) {
		this.source = source;
	}

	// TODO: this could be optimized by checking with ascii values.
	public static readonly DIGITS = "0123456789";
	public static readonly LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
	public static readonly UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	// TODO: this might be more optimized with a trie
	public static readonly KEYWORDS = ["for", "in", "if", "else", "while"];

	public static readonly OPERATOR_KEYWORDS = ["break", "continue", "return"];

	/**
	 * Returns a new lexer on the same source text but with any internal state reset.
	 */
	public clone(): Lexer {
		return new Lexer(this.source.clone());
	}

	/**
	 * Consumes the next token, and returns it.
	 */
	public nextToken(): Token {
		const source = this.source;
		const c = source.next();
		this.setTokenIndex();
		// TODO: fix issue with comments & done
		// potentially by editing the done function to see if nextToken
		// returns anything (or if c is "" then exit immediately)
		// if (c === "/") {
		// 	// two slashes == comment
		// 	if (source.peekNext() === "/") {
		// 		source.consumeUntil("\n")
		// 	}
		// }

		if ("\"'".includes(c)) {
			// consume until we see the same type of quote again
			const buffer = source.consumeUntil(
				c,
				"Expected string to be closed."
			);
			return this.createToken(TokenType.STRING_LITERAL, buffer);
		}

		if (Lexer.DIGITS.includes(c)) {
			let buffer = c + source.consumeAll(Lexer.DIGITS);
			// if the next character is a dot, then this is part of a double.
			// otherwise, return the int
			if (
				// make sure the next character isn't a dot, or if it is a dot
				// that it's not followed by a number (which would make it not
				// a double).
				source.peekNext() !== "." ||
				// split it so the empty string doesn't trigger this condition
				!Lexer.DIGITS.split("").includes(this.source.peekNext(1))
			) {
				return this.createToken(TokenType.INT_LITERAL, buffer);
			} else {
				buffer += this.source.next() + source.consumeAll(Lexer.DIGITS);
				return this.createToken(TokenType.DOUBLE_LITERAL, buffer);
			}
		}
		if ("+-*/%".includes(c)) {
			let op = c;

			if (source.peekNext() === "*") {
				op = c + source.next();
			}

			// check for math assignment operators (+=, *=, **=, %=, etc.)
			if (source.peekNext() === "=") {
				source.next();
				return this.createToken(TokenType.OPERATOR, op + "=");
			}

			// check for inc/dec (++/--) (these can't be assignment operators)
			if ("+-".includes(c) && source.peekNext() === c) {
				op = c + source.next();
			}

			// return a basic operator
			return this.createToken(TokenType.OPERATOR, op);
		}

		// parentheses can technically be considered both operators and control flow characters.
		// . is an operator outside of number literals.
		if ("[]().<>!=,&|".includes(c)) {
			// == and => (function arrow) operators
			if (c === "=" && "=>".includes(source.peekNext())) {
				return this.createToken(TokenType.OPERATOR, c + source.next());
			}

			// logical operators that can be modified with the equal sign
			if ("<>!".includes(c) && source.peekNext() === "=") {
				return this.createToken(TokenType.OPERATOR, c + source.next());
			}

			// && and || operators
			if ("&|".includes(c) && source.peekNext() === c) {
				return this.createToken(TokenType.OPERATOR, c + source.next());
			}

			return this.createToken(TokenType.OPERATOR, c);
		}
		if ("\n;{}".includes(c)) {
			if (c === "\n") {
				return this.nextToken();
			}
			return this.createToken(TokenType.CONTROL, c);
		}
		if (
			("$_" + Lexer.UPPERCASE_LETTERS + Lexer.LOWERCASE_LETTERS).includes(
				c
			)
		) {
			const buffer =
				c +
				source.consumeAll(
					"$_" +
						Lexer.DIGITS +
						Lexer.UPPERCASE_LETTERS +
						Lexer.LOWERCASE_LETTERS
				);
			if (buffer === "true" || buffer === "false") {
				return this.createToken(TokenType.BOOLEAN_LITERAL, buffer);
			}
			if (Lexer.KEYWORDS.includes(buffer)) {
				return this.createToken(TokenType.KEYWORD, buffer);
			}
			if (Lexer.OPERATOR_KEYWORDS.includes(buffer)) {
				return this.createToken(TokenType.OPERATOR, buffer);
			}
			return this.createToken(TokenType.IDENTIFIER, buffer);
		}
		if (/\s/g.test(c)) {
			// skip any spaces and tabs, and other whitespace (except newlines,
			// which are parsed above).
			return this.nextToken();
		}

		throw new JumpSyntaxError(
			`Unexpected character '${c}'.`,
			source.getPosition()
		);
	}

	public hasNextToken(): boolean {
		// if there are only whitespace characters (including trailing newlines)
		// then we can return.
		return !/^[\s\n]*$/g.test(this.source.peekNextCharacters());
	}

	// TODO: change this to generator *next() while (this.has) return so we don't have to do value stuff ourselves.
	public next(): IteratorResult<Token, null> {
		if (!this.hasNextToken()) {
			return {
				value: null,
				done: true,
			};
		}
		return {
			value: this.nextToken(),
			done: false,
		};
	}

	public getPosition(): SourcePosition {
		return this.source.getPosition();
	}

	/**
	 * Set the current token position to the lexer's next character's position
	 */
	protected setTokenIndex(): void {
		this.currentTokenIndex = this.index;
	}

	public [Symbol.iterator](): IterableIterator<Token> {
		return this;
	}

	protected createToken(type: TokenType, symbol: string) {
		return new Token(type, symbol, this.getPosition());
	}
}
