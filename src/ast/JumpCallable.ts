import SymbolTable from "./SymbolTable";
import ASTNode from "./nodes/ASTNode";

export function isCallable(obj: any): obj is JumpCallable {
	return "call" in obj;
}

/**
 * Represents a node that can potentially be called.
 */
export default interface JumpCallable {
	call(symbolTable: SymbolTable, args: ASTNode<any>[]): any;
}
