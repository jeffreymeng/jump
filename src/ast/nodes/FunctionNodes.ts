import ASTNode from "./ASTNode";
import JumpCallable from "../JumpCallable";
import SymbolTable from "../SymbolTable";
import {
	JumpArgumentError,
	JumpInternalError,
	JumpTypeError,
} from "../../errors";

export const BUILT_IN_FUNCTIONS = ["print", "max", "min", "prompt"] as const;
export type BuiltInFunctionName = typeof BUILT_IN_FUNCTIONS[number];

export class BuiltInFunctionNode
	extends ASTNode<string>
	implements JumpCallable
{
	constructor(public readonly fn: BuiltInFunctionName) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): string {
		// TODO
		return `function ${this.fn}() { [native code] }`;
	}

	public toJSON(): Record<string, any> {
		return {
			node: `Built in function: ${this.fn}`,
		};
	}

	// TODO: change args to a JumpValue or something that all expressions evaluate to instead of js primitives
	// (so classes could also be a JumpValue)
	public call(symbolTable: SymbolTable, args: any): any {
		if (this.fn === "print") {
			console.log(...args);
		} else if (this.fn === "max") {
			args.forEach((v: any) => {
				if (typeof v !== "number") {
					throw new JumpTypeError(
						`Argument '${v}' to max() is not a number.`
					);
				}
			});
			return Math.max(...args);
		} else if (this.fn === "min") {
			args.forEach((v: any) => {
				if (typeof v !== "number") {
					throw new JumpTypeError(
						`Argument '${v}' to min() is not a number.`
					);
				}
			});
			return Math.min(...args);
		} else {
			throw new JumpInternalError(
				`Unknown BuiltInFunctionNode function type: ${this.fn}`
			);
		}
	}
}