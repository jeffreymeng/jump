import ASTNode from "./ASTNode";
import SymbolTable from "../SymbolTable";

export class StatementNode extends ASTNode<void> {
	evaluate(symbolTable: SymbolTable): void {
		//
	}

	public toJSON() {
		return {
			node: `Statement`,
		};
	}
}

export class CompoundStatementNode extends ASTNode<void> {
	constructor(public readonly statements: ASTNode<any>[]) {
		super();
	}

	evaluate(symbolTable: SymbolTable): void {
		this.statements.forEach((s) => s.evaluate(symbolTable));
	}

	public toJSON() {
		return {
			node: `Compound Statement`,
			statements: this.statements.map((s) => s.toJSON()),
		};
	}
}

export class ExpressionNode extends ASTNode<any> {
	constructor(public readonly expression: ASTNode<any>) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): any {
		return this.expression.evaluate(symbolTable);
	}

	public toJSON() {
		return {
			node: `Expression`,
			statements: this.expression.toJSON(),
		};
	}
}

export class IfStatementNode extends ASTNode<void> {
	constructor(
		public readonly condition: ExpressionNode,
		public readonly statements: CompoundStatementNode
	) {
		super();
	}

	evaluate(symbolTable: SymbolTable): void {
		if (this.condition.evaluate(symbolTable)) {
			this.statements.evaluate(symbolTable);
		}
	}

	public toJSON() {
		return {
			node: `If Statement`,
			condition: this.condition.toJSON(),
			statements: this.statements.toJSON(),
		};
	}
}


export class WhileStatementNode extends ASTNode<void> {
	constructor(
		public readonly condition: ExpressionNode,
		public readonly statements: CompoundStatementNode
	) {
		super();
	}

	evaluate(symbolTable: SymbolTable): void {
		while (this.condition.evaluate(symbolTable)) {
			this.statements.evaluate(symbolTable);
		}
	}

	public toJSON() {
		return {
			node: `While Statement`,
			condition: this.condition.toJSON(),
			statements: this.statements.toJSON(),
		};
	}
}
