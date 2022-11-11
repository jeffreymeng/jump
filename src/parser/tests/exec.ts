import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import SymbolTable from "../../ast/SymbolTable";

export default function exec(source: string, symbolTable = new SymbolTable()) {
	return new Parser(new Lexer(new Source(source)))
		.getRoot()
		.evaluate(symbolTable);
}
