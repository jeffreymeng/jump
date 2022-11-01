import { describe, test } from "@jest/globals";

import Lexer from "./Lexer";
import Source from "./Source";

describe("Lexer", () => {
	test("Basic Lexing", () => {
		const s = `"hello" 2 3 0.2 42.294 "hello" "23.1"`;
		const lexer = new Lexer(new Source(s));
		// eventually there should be an error
		for (const token of lexer) {
			console.log(token);
		}
	});
});
