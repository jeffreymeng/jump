import Token, { TokenType } from "../../lexer/Token";
import ASTNode from "./ASTNode";
import {
	JumpDivisionByZeroError,
	JumpInternalError,
	JumpTypeError,
} from "../../errors";
import SymbolTable from "../SymbolTable";
import { isCallable } from "../JumpCallable";

export class BinaryOperatorNode extends ASTNode<number> {
	constructor(
		public readonly left: ASTNode<number>,
		public readonly operator: Token,
		public readonly right: ASTNode<number>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): number {
		// todo: allow operator overloading, check types
		// operator overloading would entail moving this operator code into a
		// class. How do you represent a class in an ast? How do functions work
		// in a symbol table?

		const left = this.left.evaluate(symbolTable);
		const right = this.right.evaluate(symbolTable);

		if (this.operator.is(TokenType.OPERATOR, "+")) {
			return left + right;
		} else if (this.operator.is(TokenType.OPERATOR, "-")) {
			return left - right;
		} else if (this.operator.is(TokenType.OPERATOR, "*")) {
			return left * right;
		} else if (this.operator.is(TokenType.OPERATOR, "/")) {
			if (right === 0) {
				throw new JumpDivisionByZeroError(left, this.operator.position);
			}
			return left / right;
		} else if (this.operator.is(TokenType.OPERATOR, "**")) {
			return left ** right;
		} else if (this.operator.is(TokenType.OPERATOR, "%")) {
			return left % right;
		} else {
			throw new JumpInternalError(
				`Unexpected token for BinaryOperatorNode operator. Got ${this.operator.toString()},` +
					` but expected one of: +, -, *, /, **, %.`
			);
		}
	}

	public toJSON() {
		return {
			node: `Binary ${this.operator.symbol}`,
			right: this.right.toJSON(),
		};
	}
}

export class UnaryOperatorNode extends ASTNode<number> {
	constructor(
		public readonly operator: Token,
		public readonly right: ASTNode<number>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): number {
		// todo: allow operator overloading, check types
		if (this.operator.is(TokenType.OPERATOR, "+")) {
			return this.right.evaluate(symbolTable);
		} else if (this.operator.is(TokenType.OPERATOR, "-")) {
			return -1 * this.right.evaluate(symbolTable);
		} else {
			throw new JumpInternalError(
				`Unexpected token for UnaryOperatorNode operator. Got ${this.operator.toString()},` +
					` but expected a plus or minus operator.`
			);
		}
	}

	public toJSON() {
		return {
			node: `Unary ${this.operator.symbol}`,
			right: this.right.toJSON(),
		};
	}
}

export class CallNode extends ASTNode<any> {
	constructor(
		public readonly callee: ASTNode<any>,
		public readonly args: ASTNode<any>[]
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable) {
		if (!isCallable(this.callee)) {
			throw new JumpTypeError(
				`Unable to call ${this.callee.evaluate(symbolTable)}`
			);
		}
		return this.callee.call(
			symbolTable,
			this.args.map((arg) => arg.evaluate(symbolTable))
		);
	}

	public toJSON() {
		return {
			node: `Call`,
			callee: this.callee.toJSON(),
			args: this.args.map((arg) => arg.toJSON()),
		};
	}
}
