import SymbolTable from "../SymbolTable";
import SourcePosition from "../../lexer/SourcePosition";

/**
 * An error in the implementation of Jump's AST.
 */
export class JumpASTInternalError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export default abstract class ASTNode<T> {
	/**
	 * Evaluates this node (and its child nodes) and returns the value.
	 */
	public abstract evaluate(symbolTable?: SymbolTable): T;

	/**
	 * Returns generated Java code from this node (and its child nodes).
	 */
	// public abstract generate(): string;
}
