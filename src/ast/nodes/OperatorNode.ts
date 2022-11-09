import Token, { TOKEN_TYPE } from "../../lexer/Token";
import ASTNode, { JumpASTInternalError } from "./ASTNode";

export class BinaryOperatorNode extends ASTNode<number> {
	constructor(
		public readonly left: ASTNode<number>,
		public readonly operator: Token,
		public readonly right: ASTNode<number>
	) {
		super();
	}

	public evaluate(): number {
		// todo: allow operator overloading, check types
		// operator overloading would entail moving this operator code into a
		// class. How do you represent a class in an ast? How do functions work
		// in a symbol table?

		const left = this.left.evaluate();
		const right = this.right.evaluate();

		if (this.operator.is(TOKEN_TYPE.OPERATOR, "+")) {
			return left + right;
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "-")) {
			return left - right;
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "*")) {
			return left * right;
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "/")) {
			return left / right;
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "**")) {
			return left ** right;
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "%")) {
			return left % right;
		} else {
			throw new JumpASTInternalError(
				`Unexpected token for BinaryOperatorNode operator. Got ${this.operator.toString()},` +
					` but expected one of: +, -, *, /, **, %.`
			);
		}
	}

}

export class UnaryOperatorNode extends ASTNode<number> {
	constructor(
		public readonly operator: Token,
		public readonly right: ASTNode<number>
	) {
		super();
	}

	public evaluate(): number {
		// todo: allow operator overloading, check types
		if (this.operator.is(TOKEN_TYPE.OPERATOR, "+")) {
			return this.right.evaluate();
		} else if (this.operator.is(TOKEN_TYPE.OPERATOR, "-")) {
			return -1 * this.right.evaluate();
		} else {
			throw new JumpASTInternalError(
				`Unexpected token for UnaryOperatorNode operator. Got ${this.operator.toString()},` +
					` but expected a plus or minus operator.`
			);
		}
	}

}
