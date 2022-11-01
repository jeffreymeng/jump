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
		this.name = "Lexer Error";
		this.position = position;
	}
}

/**
 * "SheetsScript" syntax error -- so it's not the same as a native syntax error.
 */
export class SSSyntaxError extends Error {
	public readonly position: SourcePosition;

	constructor(message: string, position: SourcePosition) {
		super(message);
		this.name = "SSSyntax Error";
		this.position = position;
	}
}


export default class Lexer implements Iterator<Token> {
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

	public static readonly DIGITS = "0123456789";



	/**
	 * Consumes the next token, and returns it.
	 */
	public nextToken(): Token {
		const c = this.source.next();
		this.setTokenIndex();

		if ("\"'".includes(c)) {
			// consume until we see the same type of quote again
			const buffer = this.source.consumeUntil(c);
			return new Token(TOKEN_TYPE.STRING, buffer);
		} else if (Lexer.DIGITS.includes(c)) {
			let buffer = c + this.source.consumeAll(Lexer.DIGITS);
			// if the next character is a dot, then this is part of a float, so keep going.
			if (this.source.peekNext() === ".") {
				buffer += this.source.next() + this.source.consumeAll(Lexer.DIGITS);
			}
			return new Token(TOKEN_TYPE.NUMBER, buffer);
		} else if (c === "\n") {
			return new Token(TOKEN_TYPE.CONTROL, "\n");
		} else if (/[ \t]/g.test(c)) {
			// skip any spaces and tabs.
			return this.nextToken();
		}

		throw new SSSyntaxError(
			`Unexpected character '${c}'.`,
			this.source.getPosition()
		);
	}

	public hasNextToken(): boolean {
		// if there are only whitespace characters (including newlines)
		// then we can
		return !/[\s\n]*/g.test(this.source.peekNext());
	}

	public next(): IteratorResult<Token> {
		if (!this.hasNextToken()) {
			return {
				value: null,
				done: true
			}
		}
		return {
			value: this.nextToken(),
			done: this.hasNextToken(),
		};
	}

	/**
	 * Set the current token position to the lexer's next character's position
	 */
	protected setTokenIndex() {
		this.currentTokenIndex = this.index;
	}
}
