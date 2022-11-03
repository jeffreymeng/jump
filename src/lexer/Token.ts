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

	public equals(other: Token) {
		return this.type === other.type && this.symbol === other.symbol;
	}
}

