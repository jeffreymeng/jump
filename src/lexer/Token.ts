export enum TOKEN_TYPE {
	STRING = "string",
	NUMBER = "number",
	OPERATOR = "operator",
	IDENTIFIER = "identifier",
	CONTROL = "control",
	RANGE = "range",
	REFERENCE = "reference",
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
}

