import ASTNode from "./ASTNode";

export class StatementNode extends ASTNode<void> {
	evaluate(): void {
		//
	}
}

export class CompoundStatementNode extends ASTNode<void> {
	constructor(public readonly statements: StatementNode[]) {
		super();
	}

	evaluate(): void {
		this.statements.forEach(s => s.evaluate());
	}
}
