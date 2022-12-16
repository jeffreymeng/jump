import Lexer from "./lexer/Lexer";
import Source from "./lexer/Source";
import * as readline from "readline";
import Parser from "./parser/Parser";
import { promises as fs } from "fs";
import * as util from "util";
import SymbolTable from "./ast/SymbolTable";
import execLine from "./parser/tests/execLine";
import getDetails  from "./jump/getDetail";

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
		let input = await getInput("Jump> ");
		if (input.trim() === "") continue;
		if (!input.endsWith(";")) {
			input += ";";
		}
		if (input === "exit") break;
		if (input === "reset") {
			symbolTable = new SymbolTable();
			continue;
		}
		if (input.startsWith("detail")) {
			// it can either be 'detail' or 'detail [filepath]'
			if (input.split(" ").length <= 2) {
				if (!source) {
					console.log(
						"Unable to debug as no expressions have been executed yet."
					);

					continue;
				}
				const details = getDetails(source.clone());
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
			const result = execLine(input, symbolTable);
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
