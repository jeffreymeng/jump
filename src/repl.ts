import Lexer from "./lexer/Lexer";
import Source from "./lexer/Source";
import * as readline from "readline";
import Parser from "./parser/Parser";
import { promises as fs } from "fs";
import * as util from "util";
import SymbolTable from "./ast/SymbolTable";
// const s = `"hello" 2 0.2 42.294 "23.1"`;
// const expected = [
// 	new Token(TOKEN_TYPE.STRING_LITERAL, "hello"),
// 	new Token(TOKEN_TYPE.INT_LITERAL, "2"),
// 	new Token(TOKEN_TYPE.DOUBLE_LITERAL, "0.2"),
// 	new Token(TOKEN_TYPE.DOUBLE_LITERAL, "42.294"),
// 	new Token(TOKEN_TYPE.STRING_LITERAL, "23.1")
// ]

async function repl() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const getInput = async (question: string): Promise<string> =>
		await new Promise((res, rej) =>
			rl.question(question, (answer) => res(answer))
		);

	let symbolTable = new SymbolTable();

	console.log("Jump REPL v0.0.2");
	console.log(
		"Type exit to exit, reset to reset memory, detail for details on last entry."
	);
	// persist to allow the debug keyword to go back one
	let source: Source | undefined;
	while (true) {
		const input = await getInput("Jump> ");
		if (input === "exit") break;
		if (input === "reset") {
			symbolTable = new SymbolTable();
			continue;
		}
		if (input.startsWith("detail")) {
			// it can either be 'detail' or 'detail [filepath]'
			if (input.split(" ").length <= 2) {
				const details: any[] = [];
				if (!source) {
					details.push(
						"Unable to debug as no expressions have been executed yet."
					);

					continue;
				}
				const lexer = new Lexer(source.clone());
				details.push("=== DETAIL VIEW ===");
				details.push("Lexer: ");
				try {
					details.push(
						...Array.from(lexer).map((token) => token.toString())
					);
					try {
						details.push("Parser: ");
						details.push(
							new Parser(lexer.clone()).getRoot().toJSON()
						);
						details.push("");
						details.push("");
					} catch (e) {
						details.push("Parser failed with error: ");
						details.push(e);
					}
				} catch (e) {
					details.push("Lexer failed with error: ");
					details.push(e);
				}
				details.push("===================");
				if (input.split(" ").length === 1) {
					details.forEach((line) => console.log(line));
				} else if (input.split(" ")[1]) {
					const path = input.split(" ")[1];
					await fs.writeFile(
						path,
						details
							.map((obj) =>
								typeof obj === "string"
									? obj
									: util.inspect(obj, false, null)
							)
							.join("\n"),
						"utf8"
					);
				}
				continue;
			}
		}

		try {
			source = new Source(input);
			const lexer = new Lexer(source);
			const root = new Parser(lexer).getRoot();
			const result = root.evaluate(symbolTable);
			if (result !== undefined) {
				console.log(result);
			}
		} catch (e) {
			console.log(e);
		}
	}

	rl.close();
}

repl();
