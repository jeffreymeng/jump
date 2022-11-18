import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import SymbolTable from "../../ast/SymbolTable";
import { CompoundStatementNode } from "../../ast/nodes/StatementNodes";

export default function exec(source: string, symbolTable = new SymbolTable()) {
	if (!source.endsWith(";")) {
		source += ";";
	}
	const ast = new Parser(new Lexer(new Source(source))).getRoot();

	if (ast.statements.length === 1) {
		return ast.statements[0].evaluate(symbolTable);
	}
}
