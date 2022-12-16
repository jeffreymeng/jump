import SymbolTable from "../SymbolTable";
import SourcePosition from "../../lexer/SourcePosition";

export type EvaluateOptions = {
	stdout?: (output: string) => void;
	stdin?: (input: string) => void;
};

export default abstract class ASTNode<T> {
	/**
	 * Evaluates this node (and its child nodes) and returns the value.
	 */
	public abstract evaluate(
		symbolTable: SymbolTable,
		options: EvaluateOptions
	): T;

	/**
	 * Evaluate this node (and its child nodes) to a reference (Identifier).
	 */
	public evaluateRef(symbolTable: SymbolTable, options: EvaluateOptions) {
		return this.evaluate(symbolTable, options);
	} // TODO we could also just use normal evaluate and when we get an object we get the location of that object to change it

	public abstract toJSON(): Record<string, any>;

	/**
	 * Returns generated Java code from this node (and its child nodes).
	 */
	// public abstract generate(): string;
}
