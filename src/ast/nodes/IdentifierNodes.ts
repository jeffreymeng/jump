import ASTNode from "./ASTNode";
import SymbolTable from "../SymbolTable";
import Token, { TokenType } from "../../lexer/Token";
import { JumpInternalError, JumpNameError } from "../../errors";
import JumpCallable from "../JumpCallable";
import {
	BUILT_IN_FUNCTIONS,
	BuiltInFunctionName,
	BuiltInFunctionNode,
} from "./FunctionNodes";

export class Identifier {
	constructor(public readonly name: string) {}

	/**
	 * Creates a new identifier from a token. The token must be of type
	 * IDENTIFIER, or an error will be raised.
	 * @param token - The token to convert.
	 */
	public static fromToken(token: Token) {
		if (token.type !== TokenType.IDENTIFIER) {
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
			this.value.evaluate(symbolTable)
		);
	}

	public toJSON() {
		return {
			node: `Declaration: type ${this.type}, id ${this.id}`,
			value: this.value.toJSON(),
		};
	}
}

export class VariableAssignmentNode extends ASTNode<any> {
	constructor(
		public readonly id: Identifier,
		public readonly value: ASTNode<any>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable): any {
		return symbolTable.update(
			this.id.name,
			this.value.evaluate(symbolTable)
		);
	}

	public toJSON() {
		return {
			node: `Assignment: ${this.id}`,
			value: this.value.toJSON(),
		};
	}
}

export class IdentifierNode extends ASTNode<any> implements JumpCallable {
	public readonly id: Identifier;

	constructor(id: Identifier) {
		super();
		this.id = id;
	}

	public evaluate(symbolTable: SymbolTable): any {
		if (symbolTable.has(this.id.name)) {
			return symbolTable.get(this.id.name).value;
		} else if (BUILT_IN_FUNCTIONS.includes(this.id.name as any)) {
			return new BuiltInFunctionNode(this.id.name as BuiltInFunctionName);
		} else {
			throw new JumpNameError(`Unknown identifier: ${this.id.name}`);
		}
	}

	public toJSON() {
		return {
			node: `Identifier: ${this.id.name}`,
		};
	}

	public call(symbolTable: SymbolTable, args: ASTNode<any>[]) {
		if (BUILT_IN_FUNCTIONS.includes(this.id.name as any)) {
			return new BuiltInFunctionNode(
				this.id.name as BuiltInFunctionName
			).call(symbolTable, args);
		}
		throw new JumpInternalError("Call not implemented on variables yet.");
	}
}
