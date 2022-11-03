import SourcePosition from "./SourcePosition";
import { JumpSyntaxError } from "./Lexer";

export default class Source {
	protected _index = 0;
	public readonly text: string;

	/**
	 * Returns the current index of the source.
	 */
	public get index() {
		return this._index;
	}

	constructor(text: string) {
		this.text = text;
	}

	/**
	 * Returns the next character from the source, updating the line and position as necessary.
	 * If no next character exists, returns an empty string.
	 */
	public next(): string {
		if (this._index >= this.text.length) {
			throw new JumpSyntaxError(
				"Unexpected end of input.",
				new SourcePosition(this.text, this._index)
			);
		}
		const c = this.text[this._index];
		this._index++;
		return c;
	}

	/**
	 * Returns the next character from the source without changing the current position.
	 * @param offset - If provided, the ith character after the current one is returned.
	 * If `i` is out of range, an empty string will be returned.
	 */
	public peekNext(offset = 0): string {
		if (this._index + offset >= this.text.length) {
			return "";
		}

		return this.text[this._index + offset];
	}

	/**
	 * Returns the next `len` characters from the source without changing the current position.
	 * @param len - The number of characters to return, or `0` to return the rest of source. Must be in range
	 */
	public peekNextCharacters(len = 0): string {
		if (len === 0) {
			return this.text.substring(this._index);
		}

		if (this._index + len >= this.text.length) {
			throw new JumpSyntaxError(
				"Unexpected end of file",
				new SourcePosition(this.text, this._index)
			);
		}
		return this.text.substring(this._index, this._index + len);
	}

	/**
	 * Consumes characters until any character inside endChars is found.
	 * The end character is consumed, but only the characters from
	 * the current position (inclusive) to the last character before
	 * the end character are returned. The string must eventually contain
	 * one of the endChars.
	 * @param endChars - A string containing one or more characters that will cause consumeUntil()
	 *  to stop consuming characters.
	 * @param errorMessageIfNotFound - If the string does not eventually contain
	 * an endChar, then this message will be used instead of the default error message.
	 */
	public consumeUntil(
		endChars: string,
		errorMessageIfNotFound = "Unexpected end of input."
	): string {
		const consumed = this.consumeWhile((c) => !endChars.includes(c));
		// consume the character that caused the predicate to fail, unless
		// we reached the end of the string already (and thus nothing caused
		// this to throw), which would cause an error.
		if (this._index < this.text.length) {
			this.next();
		} else {
			throw new JumpSyntaxError(
				errorMessageIfNotFound,
				this.getPosition()
			);
		}
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
		while (this.hasNext() && predicate(this.peekNext())) {
			buffer += this.next();
		}
		return buffer;
	}

	/**
	 * Get a SourcePosition object corresponding to the `i`th character of the source,
	 * or the current index if none is provided.
	 */
	public getPosition(i = this._index) {
		return new SourcePosition(this.text, i);
	}

	/**
	 * Returns true if the source has a next token (e.g. has not reached the end yet).
	 */
	public hasNext() {
		return this._index < this.text.length;
	}
}
