import Lexer from "../lexer/Lexer";
import Token from "../lexer/Token";

class Parser {
	protected lexer: Lexer;
	protected peekedToken: Token | null = null;
	constructor(lexer: Lexer) {
		this.lexer = lexer;
	}

	protected hasNext() {

	}

	protected next() {
		if (this.peekedToken) {
			return this.peekedToken;
		}
		return this.lexer.next().value;
	}

	protected peek() {
		if (this.peekedToken) {
			return this.peekedToken;
		}
		this.peekedToken = this.lexer.next().value;
		return this.peekedToken;
	}
	public getRoot() {
		return this.getStatement();
	}

	protected getStatement() {

	}
}