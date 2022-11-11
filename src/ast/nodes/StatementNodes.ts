import ASTNode from "./ASTNode";

export class StatementNode extends ASTNode<void> {
	evaluate(symbolTable): void {
		//
	}

	public toJSON() {
		return {
			node: `Statement`,
		};
	}
}

export class CompoundStatementNode extends ASTNode<void> {
	constructor(public readonly statements: StatementNode[]) {
		super();
	}

	evaluate(symbolTable): void {
		this.statements.forEach((s) => s.evaluate(symbolTable));
	}

	public toJSON() {
		return {
			node: `Compound Statement`,
			statements: this.statements.map((s) => s.toJSON()),
		};
	}
}
