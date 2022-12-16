import ASTNode, { EvaluateOptions } from "./ASTNode";
import SourcePosition from "../../lexer/SourcePosition";
import SymbolTable, { SCOPE_TYPE } from "../SymbolTable";

export default class RootNode extends ASTNode<any> {
	constructor(public readonly statements: ASTNode<any>[]) {
		super();
	}

	evaluate(symbolTable: SymbolTable, options: EvaluateOptions): void {
		this.statements.forEach((s) => s.evaluate(symbolTable, options));
	}

	public toJSON() {
		return {
			node: `Root`,
			statements: this.statements.map((s) => s.toJSON()),
		};
	}
}
