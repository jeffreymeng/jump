import Lexer from "../lexer/Lexer";
import Token, { TokenType } from "../lexer/Token";
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
	VariableNode,
} from "../ast/nodes/IdentifierNodes";
import { JumpSyntaxError } from "../errors";

const ERROR_MESSAGES = {
	END_OF_INPUT: "Unexpected end of input.",
};

export default class Parser {
	protected lexer: Lexer;
	protected peekedTokens: Token[] = [];
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
		// match 'int x' or 'x = '
		if (
			this.peekMatches(TokenType.IDENTIFIER) &&
			(this.peek(2)?.is(TokenType.IDENTIFIER) ||
				this.peek(2)?.is(TokenType.OPERATOR, "="))
		) {
			return this.getAssignment();
		}
		return this.getExpression();
	}

	// assignment ::= type identifier = expression;
	/**
	 * Get the next variable assignment or declaration.
	 */
	protected getAssignment() {
		const next = this.next(TokenType.IDENTIFIER);
		if (this.peekMatches(TokenType.IDENTIFIER)) {
			const type = next;
			// this is a declaration
			const identifier = this.next(TokenType.IDENTIFIER);
			this.next(TokenType.OPERATOR, "=");
			const expression = this.getExpression();
			return new VariableDeclarationNode(
				Identifier.fromToken(identifier),
				new TypeIdentifier(type.symbol),
				expression
			);
		} else {
			const identifier = next;
			this.next(TokenType.OPERATOR, "=");
			const expression = this.getExpression();
			return new VariableAssignmentNode(
				Identifier.fromToken(identifier),
				expression
			);
		}
	}

	// expression ::= term | term ("+" term)* | term ("-" term)*;
	protected getExpression(): ASTNode<any> {
		let left = this.getTerm();

		while (this.peekMatches(TokenType.OPERATOR, ["+", "-"])) {
			left = new BinaryOperatorNode(left, this.next(), this.getTerm());
		}
		return left;
	}

	// term ::= factor | factor ("*" factor)* | factor ("/" factor)*;
	protected getTerm(): ASTNode<any> {
		let left = this.getFactor();
		while (this.peekMatches(TokenType.OPERATOR, ["*", "/", "%"])) {
			left = new BinaryOperatorNode(left, this.next(), this.getFactor());
		}
		return left;
	}

	// factor ::= base | (base "**")* base ;
	protected getFactor(): ASTNode<any> {
		const left = this.getBase();
		if (this.peekMatches(TokenType.OPERATOR, "**")) {
			return new BinaryOperatorNode(left, this.next(), this.getFactor());
		}
		return left;
	}

	// base ::= "(" expression ")" | number | "+" base | "-" base ;
	protected getBase(): ASTNode<any> {
		if (this.peekMatches(TokenType.OPERATOR, "(")) {
			this.next(TokenType.OPERATOR, "(");
			const exp = this.getExpression();
			this.next(TokenType.OPERATOR, ")");
			return exp;
		} else if (this.peekMatches(TokenType.OPERATOR, ["+", "-"])) {
			return new UnaryOperatorNode(this.next(), this.getBase());
		} else if (this.peek()?.type === TokenType.INT_LITERAL) {
			return new IntNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.DOUBLE_LITERAL) {
			return new DoubleNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.IDENTIFIER) {
			return new VariableNode(Identifier.fromToken(this.next()));
		}

		// invalid token
		throw new JumpSyntaxError(
			`Unexpected token ${this.peek()!.symbol}`,
			this.lexer.getPosition()
		);
	}

	/**
	 * Whether or not the parser has a next token to consume.
	 * @protected
	 */
	protected hasNext(): boolean {
		// return true if there's a peeked token or if the lexer has a next token.
		return this.peekedTokens.length > 0 || this.lexer.hasNextToken();
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
	protected next(assertType: TokenType): Token;

	/**
	 * Consumes and returns the next token from the parser's lexer. If the type and symbol of the token doesn't
	 * match the provided arguments, an error will be thrown.
	 * @param assertType - The expected type of the token.
	 * @param assertSymbol - The expected symbol of the token.
	 * @protected
	 */
	protected next(assertType: TokenType, assertSymbol: string): Token;

	protected next(assertType?: TokenType, assertSymbol?: string): Token {
		if (
			assertType &&
			(!this.peekMatches(assertType) ||
				(assertSymbol && !this.peekMatches(assertType, assertSymbol)))
		) {
			throw new JumpSyntaxError(
				`Expected a '${assertSymbol}' ${assertType} token, but got a '${
					this.peek()!.symbol
				}' ${this.peek()!.type} token.`,
				this.position
			);
		}
		if (this.peekedTokens.length > 0) {
			return this.peekedTokens.shift()!;
		}
		return this.nextFromLexer();
	}

	/**
	 * Returns the next token from the lexer, ignoring any peeked tokens in the queue.
	 * @protected
	 */
	protected nextFromLexer() {
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
	 * @param n - The number of tokens forwards to peek. e.g. n = 2 will give the
	 * 	next next token without consuming any tokens. Default: n = 1.
	 * @protected
	 */
	protected peek(n = 1): Token | null {
		while (this.peekedTokens.length < n) {
			// if n == 1, continue and have an error be thrown.
			if (n !== 1 && !this.lexer.hasNextToken()) {
				return null;
			}
			this.peekedTokens.push(this.nextFromLexer());
		}
		return this.peekedTokens[n - 1];
	}

	/**
	 * Returns true if a next token exists peekNext() matches the type provided.
	 * @param type - The type to check.
	 * @protected
	 */
	protected peekMatches(type: TokenType): boolean;

	/**
	 * Returns true if a next token exists peekNext() matches the type, and the
	 * value matches symbol, or is in symbols if symbol is an array.
	 * @param type - The type to check.
	 * @param symbols - An array of symbols to check against.
	 * @protected
	 */
	protected peekMatches(type: TokenType, symbol: string | string[]): boolean;

	protected peekMatches(
		type: TokenType,
		symbol?: string | string[]
	): boolean {
		if (!this.hasNext()) return false;

		if (typeof symbol === "string") {
			// symbol is a string
			return !!this.peek()?.is(type, symbol);
		} else if (symbol) {
			// symbol is an array
			return symbol.some((s) => this.peekMatches(type, s));
		} else {
			// symbol is not defined
			return this.peek()?.type === type;
		}
	}
}
