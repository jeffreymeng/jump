import SymbolTable from "../SymbolTable";


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