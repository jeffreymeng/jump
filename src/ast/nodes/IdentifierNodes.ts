import ASTNode from "./ASTNode";
import SymbolTable from "../SymbolTable";
import Token, { TOKEN_TYPE } from "../../lexer/Token";
import { JumpSyntaxError } from "../../lexer/Lexer";
import { JumpInternalError } from "../JumpInternalError";

export class Identifier {
	constructor(public readonly name: string) {}

	/**
	 * Creates a new identifier from a token. The token must be of type
	 * IDENTIFIER, or an error will be raised.
	 * @param token - The token to convert.
	 */
	public static fromToken(token: Token) {
		if (token.type !== TOKEN_TYPE.IDENTIFIER) {
			throw new JumpInternalError(
				"Identifier.fromIdentifier expected a token of type identifier, but got: " +
					token.toString()
			);
		}
		return new Identifier(token.symbol);
	}
}

export class TypeIdentifier extends Identifier {
	constructor(
		name: string, // might need a separate symbol table for types
		modifiers?: any /* modifiers: ??? e.g. array */
	) {
		super(name);
	}
}

export class VariableDeclarationNode extends ASTNode<any> {
	constructor(
		public readonly id: Identifier,
		public readonly type: TypeIdentifier,
		public readonly value: ASTNode<any>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): any {
		return symbolTable.declare(
			this.id.name,
			this.type.name,
			this.value.evaluate()
		);
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
