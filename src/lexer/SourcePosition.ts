/**
 * A SourcePosition refers to a specific position in the source.
 * Each character in the source has a unique position.
 */
export default class SourcePosition {
	/**
	 * @param source - The text of the source code.
	 * @param index - The index of the character within the source text.
	 */
	constructor(protected readonly source: string, protected readonly index: number) {
		if (index >= source.length) {
			throw new Error("SourcePosition expected an index less than the length of source.")
		}
	}

	/**
	 * Returns the line of the index in the given source text. Lines are 1-indexed.
	 */
	public getLine(): number {
		return this.source.substring(0, this.index).split("\n").length
	}

	/**
	 * Returns the index of the character within its line. Columns are
	 * 1-indexed.
	 */
	public getCol(): number {
		// given the column, look backwards for the closest newline strictly
		// before the current index, since if the current character is a
		// newline that doesn't count.
		return this.index - this.source.lastIndexOf("\n", this.index - 1);
	}

}
