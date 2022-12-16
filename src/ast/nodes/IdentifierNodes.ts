import ASTNode, { EvaluateOptions } from "./ASTNode";
import SymbolTable from "../SymbolTable";
import Token, { TokenType } from "../../lexer/Token";
import { JumpInternalError, JumpNameError, JumpReturn } from "../../errors";
import JumpCallable from "../JumpCallable";
import {
	BUILT_IN_FUNCTIONS,
	BuiltInFunctionName,
	BuiltInFunctionNode,
} from "./FunctionNodes";
import { FunctionObject } from "../objects/FunctionObject";
import SourcePosition from "../../lexer/SourcePosition";

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

	public toString() {
		return this.name;
	}
}

export class TypeIdentifier extends Identifier {
	constructor(
		name: string, // might need a separate symbol table for types
		modifiers?: any /* modifiers: ??? e.g. array */
	) {
		super(name);
	}

	public toString() {
		return this.name;
	}
}

export type TypedIdentifier = {
	type: TypeIdentifier;
	name: Identifier;
};

export class VariableDeclarationNode extends ASTNode<any> {
	constructor(
		public readonly id: Identifier,
		public readonly type: TypeIdentifier,
		public readonly value: ASTNode<any>
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions): any {
		return symbolTable.declare(
			this.id.name,
			this.type.name,
			this.value.evaluate(symbolTable, options)
		);
	}

	public toJSON() {
		return {
			node: `Declaration: type ${this.type.toString()}, id ${this.id.toString()}`,
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

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions): any {
		return symbolTable.update(
			this.id.name,
			this.value.evaluate(symbolTable, options)
		);
	}

	public toJSON() {
		return {
			node: `Assignment: ${this.id.toString()}`,
			value: this.value.toJSON(),
		};
	}
}

export class FunctionDeclarationNode extends ASTNode<any> {
	constructor(
		public readonly id: Identifier,
		public readonly params: TypedIdentifier[],
		public readonly returnType: TypeIdentifier,
		public readonly definition: ASTNode<any>[],
		public readonly position: SourcePosition
	) {
		super();
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions): any {
		return symbolTable.declare(
			this.id.name,
			"TODO: function",
			new FunctionObject(
				this.definition,
				this.position,
				this.id.name,
				this.params
			)
		);
	}

	public toJSON() {
		return {
			node: `Function definition: ${this.id.toString()}`,
			id: this.id.name,
			definition: this.definition.map((s) => s.toJSON()),
		};
	}
}

export class IdentifierNode extends ASTNode<any> implements JumpCallable {
	public readonly id: Identifier;

	constructor(id: Identifier) {
		super();
		this.id = id;
	}

	public evaluate(symbolTable: SymbolTable, options: EvaluateOptions): any {
		if (symbolTable.has(this.id.name)) {
			return symbolTable.get(this.id.name).value;
		} else if (BUILT_IN_FUNCTIONS.includes(this.id.name as any)) {
			return new BuiltInFunctionNode(this.id.name as BuiltInFunctionName);
		} else {
			throw new JumpNameError(
				`Unknown identifier: ${this.id.toString()}`
			);
		}
	}

	public toJSON() {
		return {
			node: `Identifier: ${this.id.toString()}`,
		};
	}

	public call(
		symbolTable: SymbolTable,
		options: EvaluateOptions,
		args: any[]
	) {
		if (
			symbolTable.has(this.id.name) &&
			symbolTable.get(this.id.name).value instanceof FunctionObject
		) {
			return (<FunctionObject>symbolTable.get(this.id.name).value).call(
				symbolTable,
				options,
				args
			);
		} else if (BUILT_IN_FUNCTIONS.includes(this.id.name as any)) {
			return new BuiltInFunctionNode(
				this.id.name as BuiltInFunctionName
			).call(symbolTable, options, args);
		} else {
			throw new JumpInternalError(
				`Cannot call variable '${this.id.name}' of type '(TODO)'.`
			); // TODO: improve message
		}
	}
}
