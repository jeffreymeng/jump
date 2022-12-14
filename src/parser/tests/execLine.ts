import Parser from "../Parser";
import Lexer from "../../lexer/Lexer";
import Source from "../../lexer/Source";
import SymbolTable from "../../ast/SymbolTable";
import { BlockNode } from "../../ast/nodes/StatementNodes";

/**
 * Execute a line of jump source code. A semicolon is not required at
 * the end of the line. If the line is an expression, its value will
 * be returned.
 * @param source
 * @param symbolTable
 */
export default function execLine(
	source: string,
	symbolTable = new SymbolTable()
): any {
	if (!source.endsWith(";")) {
		source += ";";
	}
	return exec(source, symbolTable);
}

/**
 * Execute jump source code.
 * @param source
 * @param symbolTable
 */
export function exec(source: string, symbolTable = new SymbolTable()): any {
	const ast = new Parser(new Lexer(new Source(source))).getRoot();
	return ast.evaluate(symbolTable, {});
}

/**
 * Executes the provided jump source code and captures standard output. Returns a list
 * of lines of standard output.
 * @param source
 * @param symbolTable
 */
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
