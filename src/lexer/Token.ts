export enum TOKEN_TYPE {
	STRING_LITERAL = "string_literal",
	INT_LITERAL = "int_literal",
	DOUBLE_LITERAL = "double_literal",
	OPERATOR = "operator",
	IDENTIFIER = "identifier",
	CONTROL = "control",
	KEYWORD = "keyword",
}
export default class Token {
	/**
	 *
	 * @param type - The type of the token
	 * @param symbol - The value of the token
	 */
	constructor(
		public readonly type: TOKEN_TYPE,
		public readonly symbol: string
	) {}

	/**
	 * Returns whether or not the token matches another token, in terms of content.
	 * @param other
	 */
	public equals(other: Token) {
		return this.type === other.type && this.symbol === other.symbol;
	}

	/**
	 * Returns whether or not the token matches the provided type and symbol.
	 * @param type
	 * @param symbol
	 */
	public is(type: TOKEN_TYPE, symbol: string) {
		return this.type === type && this.symbol === symbol;
	}

	public toString() {
		return `Token<${this.type}, '${this.symbol}'>`;
	}
}
