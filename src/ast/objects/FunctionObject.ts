import JumpObject from "./JumpObject";
import JumpCallable from "../JumpCallable";
import SymbolTable, { SCOPE_TYPE } from "../SymbolTable";
import ASTNode, { EvaluateOptions } from "../nodes/ASTNode";
import SourcePosition from "../../lexer/SourcePosition";
import { JumpReturn, JumpSyntaxError } from "../../errors";
import { TypedIdentifier } from "../nodes/IdentifierNodes";

export class FunctionObject extends JumpObject implements JumpCallable {
	constructor(
		public readonly statements: ASTNode<any>[],
		public readonly position: SourcePosition,
		public readonly name = "<anonymous function>",
		public readonly params: TypedIdentifier[]
	) {
		// TODO
		super(`function { (TODO) }`);
	}

	public call(
		symbolTable: SymbolTable,
		options: EvaluateOptions,
		args: ASTNode<any>[]
	) {
		if (args.length !== this.params.length) {
			throw new JumpSyntaxError(
				`function '${this.name}' expected ${this.params.length} arguments, but got ${args.length}`,
				this.position
			);
		}
		let returnValue = null;
		symbolTable.pushScope(this.name, SCOPE_TYPE.FUNCTION, this.position);
		// console.log("FUNCTION CALL", args);
		// console.log(symbolTable.getScopes().map((s) => s.symbols));
		this.params.forEach(({ name, type }, i) => {
			// console.log("declaring", name.name, type.name, args[i]);
			symbolTable.declare(name.name, type.name, args[i]);
		});

		try {
			this.statements.forEach((statement) =>
				statement.evaluate(symbolTable, options)
			);
		} catch (e) {
			if (e instanceof JumpReturn) {
				returnValue = e.returnValue;
			} else {
				throw e;
			}
		}
		// console.log(symbolTable.getScopes().map((s) => s.symbols));
		// console.log("END", args);
		symbolTable.exitScope();
		return returnValue;
	}
}
