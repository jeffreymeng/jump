import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import SymbolTable from "../../ast/SymbolTable";
import { BlockNode } from "../../ast/nodes/StatementNodes";

export default function execLine(
	source: string,
	symbolTable = new SymbolTable()
) {
	if (!source.endsWith(";")) {
		source += ";";
	}
	return exec(source, symbolTable);
}

export function exec(source: string, symbolTable = new SymbolTable()) {
	const ast = new Parser(new Lexer(new Source(source))).getRoot();

	if (ast.statements.length === 1) {
		return ast.statements[0].evaluate(symbolTable, {});
	}
	return ast.evaluate(symbolTable, {});
}

export function execOutput(
	source: string,
	symbolTable = new SymbolTable()
): string[] {
	const ast = new Parser(new Lexer(new Source(source))).getRoot();
	const output: string[] = [];
	const stdout = (...args: string[]) => output.push(args.join(" "));
	if (ast.statements.length === 1) {
		ast.statements[0].evaluate(symbolTable, {
			stdout,
		});
	} else {
		ast.evaluate(symbolTable, { stdout });
	}
	return output;
}
