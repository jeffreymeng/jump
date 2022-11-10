import Lexer, { JumpSyntaxError } from "../lexer/Lexer";
import Token, { TOKEN_TYPE } from "../lexer/Token";
import {
	BinaryOperatorNode,
	UnaryOperatorNode,
} from "../ast/nodes/OperatorNode";
import ASTNode from "../ast/nodes/ASTNode";
import { DoubleNode, IntNode } from "../ast/nodes/LiteralNodes";
import SourcePosition from "../lexer/SourcePosition";
import {
	Identifier,
	TypeIdentifier,
	VariableAssignmentNode,
	VariableDeclarationNode,
} from "../ast/nodes/IdentifierNodes";

const ERROR_MESSAGES = {
	END_OF_INPUT: "Unexpected end of input.",
};

export default class Parser {
	protected lexer: Lexer;
	protected peekedToken: Token | null = null;
	protected position: SourcePosition;

	constructor(lexer: Lexer) {
		this.lexer = lexer;
		this.position = lexer.getPosition();
	}

	public getRoot(): ASTNode<any> {
		const statement = this.getStatement();
		if (this.hasNext()) {
			const next = this.next();
			throw new JumpSyntaxError(
				`Unexpected ${next.type} token '${next.symbol}'`,
				this.lexer.getPosition()
			);
		}
		return statement;
	}

	protected getStatement() {
		// TODO: somehow check if it's a statement
		return this.getExpression();
	}

	// expression ::= term | term "+" expression | term "-" expression ;
	protected getExpression(): ASTNode<any> {
		const left = this.getTerm();

		if (this.peekMatches(TOKEN_TYPE.OPERATOR, ["+", "-"])) {
			return new BinaryOperatorNode(
				left,
				this.next(),
				this.getExpression()
			);
		}
		return left;
	}

	// term ::= factor | factor "*" term | factor "/" term ;
	protected getTerm(): ASTNode<any> {
		const left = this.getFactor();
		if (this.peekMatches(TOKEN_TYPE.OPERATOR, ["*", "/", "%"])) {
			return new BinaryOperatorNode(left, this.next(), this.getTerm());
		}
		return left;
	}

	// factor ::= base | base "**" base ;
	protected getFactor(): ASTNode<any> {
		const left = this.getBase();
		if (this.peekMatches(TOKEN_TYPE.OPERATOR, "**")) {
			return new BinaryOperatorNode(left, this.next(), this.getFactor());
		}
		return left;
	}

	// base ::= "(" expression ")" | number | "+" base | "-" base ;
	protected getBase(): ASTNode<any> {
		if (this.peekMatches(TOKEN_TYPE.OPERATOR, "(")) {
			this.next(TOKEN_TYPE.OPERATOR, "(");
			const exp = this.getExpression();
			this.next(TOKEN_TYPE.OPERATOR, ")");
			return exp;
		} else if (this.peekMatches(TOKEN_TYPE.OPERATOR, ["+", "-"])) {
			return new UnaryOperatorNode(this.next(), this.getBase());
		} else if (this.peek()?.type === TOKEN_TYPE.INT_LITERAL) {
			return new IntNode(this.next().symbol);
		} else if (this.peek()?.type === TOKEN_TYPE.DOUBLE_LITERAL) {
			return new DoubleNode(this.next().symbol);
		}

		// invalid token
		if (!this.peek()) {
			throw new JumpSyntaxError(
				ERROR_MESSAGES.END_OF_INPUT,
				this.lexer.getPosition()
			);
		} else {
			throw new JumpSyntaxError(
				`Unexpected token ${this.peek()!.symbol}`,
				this.lexer.getPosition()
			);
		}
	}

	/**
	 * Whether or not the parser has a next token to consume.
	 * @protected
	 */
	protected hasNext(): boolean {
		// return true if there's a peeked token or if the lexer has a next token.
		return !!this.peekedToken || this.lexer.hasNextToken();
	}

	/**
	 * Consumes and returns the next token from the parser's lexer. If one doesn't exist, an error will be thrown.
	 * @protected
	 */
	protected next(): Token;

	/**
	 * Consumes and returns the next token from the parser's lexer. If the type of the token doesn't
	 * match the provided type, an error will be thrown.
	 * @param assertType - The expected type of the token.
	 * @protected
	 */
	protected next(assertType: TOKEN_TYPE): Token;

	/**
	 * Consumes and returns the next token from the parser's lexer. If the type and symbol of the token doesn't
	 * match the provided arguments, an error will be thrown.
	 * @param assertType - The expected type of the token.
	 * @param assertSymbol - The expected symbol of the token.
	 * @protected
	 */
	protected next(assertType: TOKEN_TYPE, assertSymbol: string): Token;

	protected next(assertType?: TOKEN_TYPE, assertSymbol?: string): Token {
		if (
			assertType &&
			(!this.peekMatches(assertType) ||
				(assertSymbol && !this.peekMatches(assertType, assertSymbol)))
		) {
			if (!this.peek()) {
				throw new JumpSyntaxError(
					ERROR_MESSAGES.END_OF_INPUT,
					this.lexer.getPosition()
				);
			}
			throw new JumpSyntaxError(
				`Expected a '${assertSymbol}' ${assertType} token, but got a '${
					this.peek()!.symbol
				}' ${this.peek()!.type} token.`,
				this.position
			);
		}
		if (this.peekedToken) {
			const peeked = this.peekedToken;
			this.peekedToken = null;
			return peeked;
		}
		const next = this.lexer.next().value;
		this.position = this.lexer.getPosition();
		if (!next) {
			throw new JumpSyntaxError(
				ERROR_MESSAGES.END_OF_INPUT,
				this.position
			);
		}
		return next;
	}

	/**
	 * Returns the next token from the parser's lexer without consuming it.
	 * @protected
	 */
	protected peek(): Token | null {
		if (this.peekedToken) {
			return this.peekedToken;
		}

		this.peekedToken = this.next();
		return this.peekedToken;
	}

	/**
	 * Returns true if a next token exists peekNext() matches the type provided.
	 * @param type - The type to check.
	 * @protected
	 */
	protected peekMatches(type: TOKEN_TYPE): boolean;

	/**
	 * Returns true if a next token exists peekNext() matches the type & value provided.
	 * @param type - The type to check.
	 * @param symbol - The symbol to check.
	 * @protected
	 */
	protected peekMatches(type: TOKEN_TYPE, symbol: string): boolean;

	/**
	 * Returns true if a next token exists peekNext() matches the type, and the
	 * value is in the array of symbols.
	 * @param type - The type to check.
	 * @param symbols - An array of symbols to check against.
	 * @protected
	 */
	protected peekMatches(type: TOKEN_TYPE, symbols: string[]): boolean;

	protected peekMatches(
		type: TOKEN_TYPE,
		symbol?: string | string[]
	): boolean {
		if (!this.hasNext()) return false;

		if (typeof symbol === "string") {
			// symbol is a string
			return !!this.peek()?.equals(new Token(type, symbol));
		} else if (symbol) {
			// symbol is an array
			return symbol.some((s) => this.peekMatches(type, s));
		} else {
			// symbol is not defined
			return this.peek()?.type === type;
		}
	}
}
