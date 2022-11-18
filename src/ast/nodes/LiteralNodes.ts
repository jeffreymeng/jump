import ASTNode from "./ASTNode";
import { JumpInternalError } from "../../errors";

abstract class LiteralNode<T> extends ASTNode<T> {
	public readonly value: T;

	constructor(symbol: T) {
		super();
		this.value = symbol;
	}
}

export class DoubleNode extends LiteralNode<number> {
	constructor(symbol: string) {
		const value = parseFloat(symbol);
		super(value);
	}

	public evaluate() {
		return this.value;
	}

	public toJSON() {
		return {
			node: `Double Literal: ${this.value}`,
		};
	}
}

export class IntNode extends LiteralNode<number> {
	constructor(symbol: string) {
		const value = parseFloat(symbol);
		if (value % 1 !== 0) {
			throw new JumpInternalError(
				"IntNode created with non-integer value."
			);
		}
		super(value);
	}

	public evaluate() {
		return this.value;
	}

	public toJSON() {
		return {
			node: `Int Literal: ${this.value}`,
		};
	}
}

export class BooleanNode extends LiteralNode<boolean> {
	constructor(symbol: string) {
		if (symbol === "true") {
			super(true);
		} else if (symbol === "false") {
			super(false);
		} else {
			throw new JumpInternalError(
				"BooleanNode created with invalid value (expected 'true' or 'false')."
			);
		}
	}

	public evaluate() {
		return this.value;
	}

	public toJSON() {
		return {
			node: `Int Literal: ${this.value}`,
		};
	}
}

export class StringNode extends LiteralNode<string> {
	public evaluate() {
		return this.value;
	}

	public toJSON() {
		return {
			node: `String Literal: "${this.value}"`,
		};
	}
}
