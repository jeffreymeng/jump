import Token, { TokenType } from "../../lexer/Token";
import ASTNode, { EvaluateOptions } from "./ASTNode";
import {
	JumpDivisionByZeroError,
	JumpInternalError,
	JumpReturn,
	JumpSyntaxError,
	JumpTypeError,
} from "../../errors";
import SymbolTable, { SCOPE_TYPE } from "../SymbolTable";
import { isCallable } from "../JumpCallable";
import SourcePosition from "../../lexer/SourcePosition";

export class BinaryOperatorNode extends ASTNode<number | boolean> {
	constructor(
		public readonly left: ASTNode<number>,
		public readonly operator: Token,
		public readonly right: ASTNode<number>
	) {
		super();
	}

	public evaluate(
		symbolTable: SymbolTable,
		options: EvaluateOptions
	): number | boolean {
		// todo: allow operator overloading, check types
		// operator overloading would entail moving this operator code into a
		// class. How do you represent a class in an ast? How do functions work
		// in a symbol table?

		const left = this.left.evaluate(symbolTable, options);
		const right = this.right.evaluate(symbolTable, options);

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
		} else if (this.operator.is(TokenType.OPERATOR, "==")) {
			// TODO: use our own equality rules for equality (once we have objects for each data type)
			return left === right;
		} else if (this.operator.is(TokenType.OPERATOR, "!=")) {
			return left !== right;
		} else if (this.operator.is(TokenType.OPERATOR, "&&")) {
			return left && right;
		} else if (this.operator.is(TokenType.OPERATOR, "||")) {
			return left || right;
		} else if (this.operator.is(TokenType.OPERATOR, "<")) {
			return left < right;
		} else if (this.operator.is(TokenType.OPERATOR, "<=")) {
			return left <= right;
		} else if (this.operator.is(TokenType.OPERATOR, ">=")) {
			return left >= right;
		} else if (this.operator.is(TokenType.OPERATOR, ">")) {
			return left > right;
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
			left: this.left.toJSON(),
			right: this.right.toJSON(),
		};
	}
}

export class UnaryPrefixOperatorNode extends ASTNode<number | boolean> {
	constructor(
		public readonly operator: Token,
		public readonly right: ASTNode<number | boolean>
	) {
		super();
	}

	public evaluate(
		symbolTable: SymbolTable,
		options: EvaluateOptions
	): number | boolean {
		// todo: allow operator overloading, check types
		if (this.operator.is(TokenType.OPERATOR, "+")) {
			return this.right.evaluate(symbolTable, options);
		} else if (this.operator.is(TokenType.OPERATOR, "-")) {
			const right = this.right.evaluate(symbolTable, options);
			if (right === 0) {
				return right;
			}
			if (typeof right !== "number") {
				throw new JumpTypeError(
					"'-' operator cannot be used on non-numeric operands."
				);
			}
			return -1 * right;
		} else if (this.operator.is(TokenType.OPERATOR, "!")) {
			return !this.right.evaluate(symbolTable, options);
		} else if (this.operator.is(TokenType.OPERATOR, "++")) {

		} else if (this.operator.is(TokenType.OPERATOR, "--")) {

		} else {
			throw new JumpInternalError(
				`Unexpected token for UnaryPrefixOperatorNode operator. Got ${this.operator.toString()},` +
					` but expected one of: +, -, !, ++, --.`
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

export class PrefixIncDecNode extends ASTNode<any> {

}

export class CallNode extends ASTNode<any> {
	constructor(
		public readonly callee: ASTNode<any>,
		public readonly args: ASTNode<any>[]
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions) {
		if (!isCallable(this.callee)) {
			throw new JumpTypeError(
				`Unable to call ${this.callee.evaluate(symbolTable, options)}`
			);
		}
		return this.callee.call(
			symbolTable,
			options,
			this.args.map((arg) => arg.evaluate(symbolTable, options))
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

export class ReturnOperatorNode extends ASTNode<any> {
	constructor(
		public readonly returnValue: ASTNode<any> | null,
		public readonly position: SourcePosition
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions) {
		// TODO
		// maybe symbolTable is renamed into environment?
		const nearestFunction = symbolTable
			.getReversedScopes()
			.find((scope) => scope.type === SCOPE_TYPE.FUNCTION);
		if (nearestFunction === undefined) {
			throw new JumpSyntaxError(
				"Return statement not in a function",
				this.position
			);
		}
		throw new JumpReturn(this.returnValue?.evaluate(symbolTable, options));
	}

	public toJSON() {
		return {
			node: "Return Operator",
			returnValue: this.returnValue || null,
		};
	}
}
