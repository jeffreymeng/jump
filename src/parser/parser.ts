import Lexer from "../lexer/Lexer";
import Token, { TokenType } from "../lexer/Token";
import {
	BinaryOperatorNode,
	CallNode,
	UnaryOperatorNode,
} from "../ast/nodes/OperatorNode";
import ASTNode from "../ast/nodes/ASTNode";
import {
	BooleanNode,
	DoubleNode,
	IntNode,
	StringNode,
} from "../ast/nodes/LiteralNodes";
import SourcePosition from "../lexer/SourcePosition";
import {
	Identifier,
	IdentifierNode,
	TypeIdentifier,
	VariableAssignmentNode,
	VariableDeclarationNode,
} from "../ast/nodes/IdentifierNodes";
import { JumpSyntaxError } from "../errors";
import {
	CompoundStatementNode,
	ExpressionNode,
	IfStatementNode,
	StatementNode, WhileStatementNode,
} from "../ast/nodes/StatementNodes";

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

	public getRoot(): CompoundStatementNode {
		return this.getCompoundStatements();
	}

	protected getCompoundStatements(): CompoundStatementNode {
		const statements = [this.getStatement()];

		while (this.hasNext()) {
			statements.push(this.getStatement());
		}
		if (this.hasNext()) {
			const next = this.next();
			throw new JumpSyntaxError(
				`Unexpected ${next.type} token '${next.symbol}'`,
				this.lexer.getPosition()
			);
		}
		return new CompoundStatementNode(statements);
	}

	protected getBlock(): CompoundStatementNode {
		this.nextNewlines();
		this.next(TokenType.CONTROL, "{");
		const statements = [];

		while (!this.peekMatches(TokenType.CONTROL, "}")) {
			statements.push(this.getStatement());
		}

		const block = new CompoundStatementNode(statements);
		this.next(TokenType.CONTROL, "}");
		this.nextNewlines();
		return block;
	}

	protected getStatement(): StatementNode | ExpressionNode {
		// match 'int x' or 'x = '
		let left;
		if (
			this.peekMatches(TokenType.IDENTIFIER) &&
			(this.peek(2)?.is(TokenType.IDENTIFIER) ||
				this.peek(2)?.is(TokenType.OPERATOR, "="))
		) {
			left = this.getAssignment();
		} else if (this.peekMatches(TokenType.KEYWORD, ["if", "while"])) {
			const type = this.next().symbol;
			this.next(TokenType.OPERATOR, "(");
			const condition = this.getExpression();
			this.next(TokenType.OPERATOR, ")");
			this.nextNewlines();

			if (type === "if") {
				return new IfStatementNode(condition, this.getBlock());
			} else {
				return new WhileStatementNode(condition, this.getBlock());
			}
		} else {
			left = this.getExpression();
		}
		this.next(
			TokenType.CONTROL,
			";",
			"Expected semicolon after expression."
		);
		return left;
	}

	// assignment ::= type identifier = expression;
	/**
	 * Get the next variable assignment or declaration.
	 */
	protected getAssignment():
		| VariableDeclarationNode
		| VariableAssignmentNode {
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
	protected getExpression(): ExpressionNode {
		return new ExpressionNode(this.getLogicalAnd());
	}

	protected getLogicalAnd(): ASTNode<any> {
		let left = this.getLogicalOr();

		while (this.peekMatches(TokenType.OPERATOR, "&&")) {
			left = new BinaryOperatorNode(
				left,
				this.next(),
				this.getLogicalOr()
			);
		}
		return left;
	}

	protected getLogicalOr(): ASTNode<any> {
		let left = this.getEquality();

		while (this.peekMatches(TokenType.OPERATOR, "||")) {
			left = new BinaryOperatorNode(
				left,
				this.next(),
				this.getEquality()
			);
		}
		return left;
	}

	protected getEquality(): ASTNode<any> {
		let left = this.getComparison();
		while (this.peekMatches(TokenType.OPERATOR, ["==", "!="])) {
			left = new BinaryOperatorNode(
				left,
				this.next(),
				this.getComparison()
			);
		}
		return left;
	}

	protected getComparison(): ASTNode<any> {
		let left = this.getAddition();
		while (this.peekMatches(TokenType.OPERATOR, ["<", "<=", ">=", ">"])) {
			left = new BinaryOperatorNode(
				left,
				this.next(),
				this.getAddition()
			);
		}
		return left;
	}

	// expression ::= term | term ("+" term)* | term ("-" term)*;
	protected getAddition(): ASTNode<any> {
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
		const left = this.getUnary();
		if (this.peekMatches(TokenType.OPERATOR, "**")) {
			return new BinaryOperatorNode(left, this.next(), this.getFactor());
		}
		return left;
	}

	protected getUnary(): ASTNode<any> {
		if (this.peekMatches(TokenType.OPERATOR, ["+", "-"])) {
			return new UnaryOperatorNode(this.next(), this.getBase());
		} else if (this.peekMatches(TokenType.OPERATOR, "!")) {
			return new UnaryOperatorNode(this.next(), this.getUnary());
		}
		return this.getCall();
	}

	protected getCall(): ASTNode<any> {
		const left = this.getBase();
		if (this.nextIs(TokenType.OPERATOR, "(")) {
			const args = [];
			if (this.nextIs(TokenType.OPERATOR, ")")) {
				return new CallNode(left, []);
			}

			// there is at least one arg
			args.push(this.getExpression());
			while (this.nextIs(TokenType.OPERATOR, ",")) {
				args.push(this.getExpression());
			}

			this.next(TokenType.OPERATOR, ")");
			return new CallNode(left, args);
		}

		return left;
	}

	// base ::= "(" expression ")" | number;
	protected getBase(): ASTNode<any> {
		if (this.nextIs(TokenType.OPERATOR, "(")) {
			const exp = this.getExpression();
			this.next(TokenType.OPERATOR, ")");
			return exp;
		} else if (this.peek()?.type === TokenType.INT_LITERAL) {
			return new IntNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.DOUBLE_LITERAL) {
			return new DoubleNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.STRING_LITERAL) {
			return new StringNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.BOOLEAN_LITERAL) {
			return new BooleanNode(this.next().symbol);
		} else if (this.peek()?.type === TokenType.IDENTIFIER) {
			return new IdentifierNode(Identifier.fromToken(this.next()));
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
	 * @param errorMessage - An optional custom error message to fail with if the assert fails.
	 * @protected
	 */
	protected next(
		assertType: TokenType,
		assertSymbol: string,
		errorMessage?: string
	): Token;

	protected next(
		assertType?: TokenType,
		assertSymbol?: string,
		errorMessage?: string
	): Token {
		if (
			assertType &&
			(!this.peekMatches(assertType) ||
				(assertSymbol && !this.peekMatches(assertType, assertSymbol)))
		) {
			throw new JumpSyntaxError(
				errorMessage
					? errorMessage
					: `Expected a '${assertSymbol}' ${assertType} token, but got a '${
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
	 * If the next token matches the specified type and symbol, consumes it and
	 * returns true. Otherwise, returns false. Equivalent to calling peekMatches()
	 * and then next() if the result is true;
	 * @param type - The type to check for.
	 * @param symbol - The symbol to check for.
	 * @protected
	 */
	protected nextIs(type?: TokenType, symbol?: string | string[]) {
		if (this.peekMatches(type as any, symbol as any)) {
			this.next(type as any, symbol as any);
			return true;
		} else {
			return false;
		}
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

	/**
	 * Keeps consuming newlines for as long as they exist.
	 * Returns true if at least one newline was consumed.
	 * @protected
	 */
	protected nextNewlines(): boolean {
		let consumed = false;
		while (this.peekMatches(TokenType.CONTROL, "\n")) {
			consumed = true;
			this.next();
		}
		return consumed;
	}
}
