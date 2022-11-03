import { describe, expect, test } from "@jest/globals";
import Token, { TOKEN_TYPE } from "./Token";

describe("Token", () => {
	test("creating new token", () => {
		const t = new Token(TOKEN_TYPE.KEYWORD, "for");
		expect(t.type).toBe(TOKEN_TYPE.KEYWORD);
		expect(t.symbol).toBe("for");
	});

	test("equality", () => {
		const t = new Token(TOKEN_TYPE.KEYWORD, "for");
		const t2 = new Token(TOKEN_TYPE.CONTROL, "for");
		const t3 = new Token(TOKEN_TYPE.KEYWORD, "notfor");
		const t4 = new Token(TOKEN_TYPE.STRING_LITERAL, "adsf");
		const t5 = new Token(TOKEN_TYPE.KEYWORD, "for");

		expect(t.equals(t2)).toBe(false);
		expect(t.equals(t3)).toBe(false);
		expect(t.equals(t4)).toBe(false);
		expect(t.equals(t5)).toBe(true);
	});
});
