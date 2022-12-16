import ASTNode, { EvaluateOptions } from "./ASTNode";
import SymbolTable, { SCOPE_TYPE } from "../SymbolTable";
import Source from "../../lexer/Source";
import SourcePosition from "../../lexer/SourcePosition";
import { JumpError, JumpReturn } from "../../errors";

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

export class BlockNode extends ASTNode<void> {
	constructor(
		public readonly statements: ASTNode<any>[],
		public readonly position: SourcePosition
	) {
		super();
	}

	evaluate(symbolTable: SymbolTable, options: EvaluateOptions): void {
		symbolTable.pushScope(
			"<anonymous block>",
			SCOPE_TYPE.BLOCK,
			this.position
		);
		try {
			this.statements.forEach((s) => s.evaluate(symbolTable, options));
		} catch (e) {
			// make sure we still exit the scope even in the event of a return statement.
			if (e instanceof JumpReturn) {
				symbolTable.exitScope();
			}
			throw e;
		}
		symbolTable.exitScope();
	}

	public toJSON() {
		return {
			node: `Block`,
			statements: this.statements.map((s) => s.toJSON()),
		};
	}
}

export class ExpressionNode extends ASTNode<any> {
	constructor(public readonly expression: ASTNode<any>) {
		super();
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions): any {
		return this.expression.evaluate(symbolTable, options);
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
		public readonly statements: BlockNode,
		// contains the immediately following "else if" node. An "else" node
		// is represented as "else if (true)"
		public readonly elseIfStatementNode?: IfStatementNode
	) {
		super();
	}

	evaluate(symbolTable: SymbolTable, options: EvaluateOptions): void {
		if (this.condition.evaluate(symbolTable, options)) {
			this.statements.evaluate(symbolTable, options);
		} else if (this.elseIfStatementNode) {
			this.elseIfStatementNode.evaluate(symbolTable, options);
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
		public readonly statements: BlockNode
	) {
		super();
	}

	evaluate(symbolTable: SymbolTable, options: EvaluateOptions): void {
		while (this.condition.evaluate(symbolTable, options)) {
			this.statements.evaluate(symbolTable, options);
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
