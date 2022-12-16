import SymbolTable from "./ast/SymbolTable";
import fs from "fs/promises";
import Parser from "./parser/Parser";
import Lexer from "./lexer/Lexer";
import Source from "./lexer/Source";
import commandLineArgs from "command-line-args";
import util from "util";
import getDetails from "./jump/getDetail";

async function main() {
	const options = commandLineArgs([
		{ name: "file", alias: "f" },
		{ name: "debug", alias: "d" },
	]);
	const { file: filepath, debug: debugpath } = options;

	if (!filepath) {
		console.log("Usage: jump [path/to/jump/file.jmp]");
		return;
	}
	const path = filepath;
	const fileContents = (await fs.readFile(path)) + "";
	const symbolTable = new SymbolTable();

	if (debugpath === null || debugpath === undefined) {
		new Parser(new Lexer(new Source(fileContents)))
			.getRoot()
			.evaluate(symbolTable, {});
	} else {
		const details = getDetails(new Source(fileContents));
		if (debugpath === "") {
			// (and not null)
			details.forEach((line) => console.log(line));
		} else if (debugpath) {
			await fs.writeFile(
				debugpath,
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
	}
}

main();
