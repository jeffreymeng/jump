import ASTNode from "./ASTNode";
import { JumpInternalError } from "../JumpInternalError";

abstract class LiteralNode<T> extends ASTNode<T> {
	public readonly value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}
}

export class DoubleNode extends LiteralNode<number> {
	public evaluate() {
		return this.value;
	}
}

export class IntNode extends LiteralNode<number> {
	constructor(value: number) {
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
}

export class StringNode extends LiteralNode<string> {
	public evaluate() {
		return `"${this.value.replace(/"/g, '"')}"`;
	}
}
