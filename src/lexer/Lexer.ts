import Token, { TOKEN_TYPE } from "./Token";
import SourcePosition from "./SourcePosition";
import Source from "./Source";

/**
 * An error that occurred while lexing, typically not due to the input but due to
 * an implementation bug.
 */
export class LexerError extends Error {
	public readonly position: SourcePosition;

	constructor(message: string, position: SourcePosition) {
		super(message);
		this.position = position;
	}
}

/**
 * An error in the syntax of the input.
 */
export class JumpSyntaxError extends Error {
	public readonly position: SourcePosition;

	constructor(message: string, position: SourcePosition) {
		super(message);
		this.position = position;
	}
}

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
	public static readonly KEYWORDS = ["for", "in"];

	/**
	 * Consumes the next token, and returns it.
	 */
	public nextToken(): Token {
		const source = this.source;
		const c = source.next();
		this.setTokenIndex();

		if ("\"'".includes(c)) {
			// consume until we see the same type of quote again
			const buffer = source.consumeUntil(c);
			return new Token(TOKEN_TYPE.STRING_LITERAL, buffer);
		}
		if (Lexer.DIGITS.includes(c)) {
			let buffer = c + source.consumeAll(Lexer.DIGITS);
			// if the next character is a dot, then this is part of a double.
			// otherwise, return the int
			if (source.peekNext() !== ".") {
				return new Token(TOKEN_TYPE.INT_LITERAL, buffer);
			} else {
				buffer += this.source.next() + source.consumeAll(Lexer.DIGITS);
				return new Token(TOKEN_TYPE.DOUBLE_LITERAL, buffer);
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
				return new Token(TOKEN_TYPE.OPERATOR, op + "=");
			}

			// check for inc/dec (++/--) (these can't be assignment operators)
			if ("+-".includes(c) && source.peekNext() === c) {
				op = c + source.next();
			}

			// return a basic operator
			return new Token(TOKEN_TYPE.OPERATOR, op);
		}

		// parentheses can technically be considered both operators and control flow characters.
		// . is an operator outside of number literals.
		if ("[]().<>!=,&|".includes(c)) {
			// == and => (function arrow) operators
			if (c === "=" && "=>".includes(source.peekNext())) {
				return new Token(TOKEN_TYPE.OPERATOR, c + source.next());
			}

			// logical operators that can be modified with the equal sign
			if ("<>!".includes(c) && source.peekNext() === "=") {
				return new Token(TOKEN_TYPE.OPERATOR, c + source.next());
			}

			// && and || operators
			if ("&|".includes(c) && source.peekNext() === c) {
				return new Token(TOKEN_TYPE.OPERATOR, c + source.next());
			}

			return new Token(TOKEN_TYPE.OPERATOR, c);
		}
		if ("\n;{}".includes(c)) {
			return new Token(TOKEN_TYPE.CONTROL, c);
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

			if (Lexer.KEYWORDS.includes(buffer)) {
				return new Token(TOKEN_TYPE.KEYWORD, buffer);
			}
			return new Token(TOKEN_TYPE.IDENTIFIER, buffer);
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

	public next(): IteratorResult<Token> {
		if (!this.hasNextToken()) {
			return {
				value: undefined,
				done: true,
			};
		}
		return {
			value: this.nextToken(),
			done: false,
		};
	}

	/**
	 * Set the current token position to the lexer's next character's position
	 */
	protected setTokenIndex() {
		this.currentTokenIndex = this.index;
	}

	public [Symbol.iterator]() {
		return this;
	}
}
