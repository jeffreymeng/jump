import SymbolTable from "../SymbolTable";
import SourcePosition from "../../lexer/SourcePosition";

export default abstract class ASTNode<T> {
	/**
	 * Evaluates this node (and its child nodes) and returns the value.
	 */
	public abstract evaluate(symbolTable: SymbolTable): T;

	public abstract toJSON(): Record<string, any>;

	/**
	 * Returns generated Java code from this node (and its child nodes).
	 */
	// public abstract generate(): string;
}
