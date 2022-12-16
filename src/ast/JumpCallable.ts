import SymbolTable from "./SymbolTable";
import ASTNode, { EvaluateOptions } from "./nodes/ASTNode";

export function isCallable(obj: any): obj is JumpCallable {
	return "call" in obj;
}

/**
 * Represents a node that can potentially be called.
 */
export default interface JumpCallable {
	call(symbolTable: SymbolTable, options: EvaluateOptions, args: ASTNode<any>[]): any;
}
