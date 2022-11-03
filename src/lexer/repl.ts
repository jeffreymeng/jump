import Token, { TOKEN_TYPE } from "./Token";
import Lexer from "./Lexer";
import Source from "./Source";
import * as readline from "readline";

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
		output: process.stdout
	});

	const ask = async (question: string): Promise<string> =>
		await new Promise((res, rej) =>
			rl.question(question, (answer) => res(answer)));



	console.log("Jump REPL v0.0.1")
	console.log("Type exit to exit.")
	while (true) {
		const input = await ask("Jump> ")
		if (input === "exit") break;

		try {
			const lexer = new Lexer(new Source(input));

			for (const token of lexer) {
				console.log(`Token<${token.type}, ${token.symbol}>`)
			}
		} catch (e) {
			console.log(e)
		}
	}

	rl.close();
}

repl()