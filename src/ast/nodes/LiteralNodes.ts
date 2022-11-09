import ASTNode from "./ASTNode";
import { JumpInternalError } from "../JumpInternalError";

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
			name: "DoubleNode",
			value: this.value,
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
			name: "IntNode",
			value: this.value,
		};
	}
}

export class StringNode extends LiteralNode<string> {
	public evaluate() {
		return `"${this.value.replace(/"/g, '\\"')}"`;
	}

	public toJSON() {
		return {
			name: "StringNode",
			value: this.value,
		};
	}
}
