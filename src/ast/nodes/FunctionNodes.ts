import ASTNode, { EvaluateOptions } from "./ASTNode";
import JumpCallable from "../JumpCallable";
import SymbolTable from "../SymbolTable";
import {
	JumpArgumentError,
	JumpInternalError,
	JumpTypeError,
} from "../../errors";

export const BUILT_IN_FUNCTIONS = [
	"print",
	"max",
	"min",
	"prompt",
	"time",
] as const;
export type BuiltInFunctionName = typeof BUILT_IN_FUNCTIONS[number];

export class BuiltInFunctionNode
	extends ASTNode<string>
	implements JumpCallable
{
	constructor(public readonly name: BuiltInFunctionName) {
		super();
	}

	public evaluate(
		symbolTable: SymbolTable,
		options: EvaluateOptions
	): string {
		// TODO
		return `function ${this.name}() { [native code] }`;
	}

	public toJSON(): Record<string, any> {
		return {
			node: `Built in function: ${this.name}`,
		};
	}

	// TODO: change args to a JumpValue or something that all expressions evaluate to instead of js primitives
	// (so classes could also be a JumpValue)
	public call(
		symbolTable: SymbolTable,
		options: EvaluateOptions,
		args: any
	): any {
		if (this.name === "print") {
			(options.stdout || console.log)(args.join(" "));
		} else if (this.name === "max") {
			args.forEach((v: any) => {
				if (typeof v !== "number") {
					throw new JumpTypeError(
						`Argument '${v}' to max() is not a number.`
					);
				}
			});
			return Math.max(...args);
		} else if (this.name === "min") {
			args.forEach((v: any) => {
				if (typeof v !== "number") {
					throw new JumpTypeError(
						`Argument '${v}' to min() is not a number.`
					);
				}
			});
			return Math.min(...args);
		} else if (this.name === "time") {
			return Date.now();
		} else {
			throw new JumpInternalError(
				`Unknown BuiltInFunctionNode function type: ${this.name}`
			);
		}
	}
}
