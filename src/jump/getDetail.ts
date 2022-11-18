import Source from "../lexer/Source";
import Lexer from "../lexer/Lexer";
import Parser from "../parser/Parser";

export default function getDetails(source: Source): any[] {
	const details: any[] = [];

	const lexer = new Lexer(source);
	details.push("=== DETAIL VIEW ===");
	details.push("Lexer: ");
	try {
		details.push(...Array.from(lexer).map((token) => token.toString()));
		try {
			details.push("Parser: ");
			details.push(new Parser(lexer.clone()).getRoot().toJSON());
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

	return details;
}
