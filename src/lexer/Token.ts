import SourcePosition from "./SourcePosition";

export enum TokenType {
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
		public readonly type: TokenType,
		public readonly symbol: string,
		public readonly position: SourcePosition
	) {}

	/**
	 * Returns whether or not the token matches another token, in terms of content,
	 * but not position.
	 * @param other
	 */
	public equals(other: Token) {
		return this.type === other.type && this.symbol === other.symbol;
	}

	/**
	 * Returns whether or not the token matches the provided type and, if provided, symbol.
	 * @param type
	 * @param symbol
	 */
	public is(type: TokenType, symbol?: string) {
		return this.type === type && (!symbol || this.symbol === symbol);
	}

	public toString() {
		return `Token<${this.type}, '${this.symbol}'>`;
	}
}
