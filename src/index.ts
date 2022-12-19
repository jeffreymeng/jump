import Parser from "./parser/Parser";
import Lexer from "./lexer/Lexer";
import Source from "./lexer/Source";
import ASTNode, { EvaluateOptions } from "./ast/nodes/ASTNode";
import SymbolTable from "./ast/SymbolTable";

export function buildAST(source: string): ASTNode<any> {
	return new Parser(new Lexer(new Source(source))).getRoot();
}

export default function jump(
	source: string,
	evaluateOptions: EvaluateOptions = {}
): void {
	buildAST(source).evaluate(new SymbolTable(), evaluateOptions);
}

export { Lexer, Parser, Source, ASTNode, EvaluateOptions };
