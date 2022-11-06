import ASTNode from "./ASTNode";
import SymbolTable from "../SymbolTable";

export class VariableDeclarationNode extends ASTNode<any> {
	constructor(
		public readonly id: string,
		public readonly type: string,
		public readonly value: ASTNode<any>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): any {
		return symbolTable.declare(this.id, this.type, this.value.evaluate());
	}
}

export class VariableAssignmentNode extends ASTNode<any> {
	constructor(
		public readonly id: string,
		public readonly value: ASTNode<any>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): any {
		return symbolTable.update(this.id, this.value.evaluate());
	}
}


export class VariableNode extends ASTNode<any> {
	public readonly id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	public evaluate(symbolTable: SymbolTable): any {
		return symbolTable.get(this.id);
	}
}
