import SourcePosition from "./SourcePosition";
import { SSSyntaxError } from "./Lexer";

export default class Source {
	protected index = 0;
	public readonly text: string;

	constructor(text: string) {
		this.text = text;
	}
	/**
	 * Returns the next character from the source, updating the line and position as necessary.
	 * If no next character exists, returns an empty string.
	 */
	public next(): string {
		this.index ++;

		if (this.index < this.text.length) {
			throw new SSSyntaxError(
				"Unexpected end of file",
				new SourcePosition(this.text, this.index)
			);
		}
		return this.text[this.index];
	}

	/**
	 * Returns the next character from the source without changing the current position.
	 * @param offset - If provided, the ith character after the current one is returned.
	 * `i` must be a positive or integer in range, and defaults to zero.
	 */
	public peekNext(offset = 0): string {
		if (this.index + offset >= this.text.length) {
			throw new SSSyntaxError(
				"Unexpected end of file",
				new SourcePosition(this.text, this.index)
			);
		}
		return this.text[this.index + offset];
	}

	/**
	 * Returns the next `len` characters from the source without changing the current position.
	 * @param len - The number of characters to return, or `0` to return the rest of source. Must be in range
	 */
	public peekNextCharacters(len = 0): string {
		if (len === 0) {
			return this.text.substring(this.index);
		}

		if (this.index + len >= this.text.length) {
			throw new SSSyntaxError(
				"Unexpected end of file",
				new SourcePosition(this.text, this.index)
			);
		}
		return this.text.substring(this.index, this.index + len);
	}

	/**
	 * Consumes characters until any character inside endChars is found.
	 * The end character is consumed, but only the characters from
	 * the current position (inclusive) to the last character before
	 * the end character are returned.
	 * @param endChars - A string containing one or more characters that will cause consumeUntil()
	 *  to stop consuming characters.
	 */
	public consumeUntil(endChars: string): string {
		const consumed = this.consumeWhile((c) => !endChars.includes(c));
		// consume the character that caused the predicate to fail
		this.next();
		return consumed;
	}

	/**
	 * Consumes and returns characters until a character not in `chars` is found.
	 * @param chars - A string containing one or more characters to be consumed continuously.
	 */
	public consumeAll(chars: string): string {
		return this.consumeWhile((c) => chars.includes(c));
	}

	/**
	 * Consumes characters until the predicate is no longer true.
	 * All characters from the starting position until the predicate fails will be consumed and returned.
	 * The character that failed the predicate will NOT be consumed.
	 * @param predicate - A function returning true if a character passes the predicate.
	 */
	public consumeWhile(predicate: (c: string) => boolean): string {
		let buffer = "";
		while (predicate(this.peekNext())) {
			buffer += this.next();
		}
		return buffer;
	}

	/**
	 * Get a SourcePosition object corresponding to the `i`th character of the source,
	 * or the current index if none is provided.
	 */
	public getPosition(i = this.index) {
		return new SourcePosition(this.text, i);
	}
}