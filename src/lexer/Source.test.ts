import { describe, test, expect } from "@jest/globals";

import Source from "./Source";

describe("Source", () => {
	test("next & peeking functions", () => {
		const s = new Source("abcdefghijk");
		expect(s.peekNext()).toBe("a");
		expect(s.next()).toBe("a");
		expect(s.next()).toBe("b");
		expect(s.next()).toBe("c");
		expect(s.peekNext()).toBe("d");
		expect(s.peekNext()).toBe("d");
		expect(s.next()).toBe("d");
		expect(s.peekNextCharacters(3)).toBe("efg");
		expect(s.peekNextCharacters(4)).toBe("efgh");
		expect(s.peekNextCharacters()).toBe("efghijk");
	});

	test("consumeAll", () => {
		const s = new Source(`aaaabb333`);
		expect(s.consumeAll("d")).toBe("");
		expect(s.consumeAll("ab")).toBe("aaaabb");
		expect(s.peekNextCharacters()).toBe("333");
		expect(s.consumeAll("3")).toBe("333");
		expect(s.index).toBe(9);
		expect(() => s.next()).toThrowError();
	});

	test("consumeUntil", () => {
		const s = new Source(`aaaabb333`);
		expect(s.consumeUntil("b3")).toBe("aaaa");

		const s2 = new Source(`aaaabb344`);
		expect(s2.consumeUntil("3")).toBe("aaaabb");
		// it should have also consumed a 3
		expect(s2.peekNextCharacters()).toBe("44");
		expect(s2.consumeUntil("a")).toBe("44");
		expect(s2.index).toBe(s2.text.length);
		expect(() => s2.next()).toThrowError();
	});
	test("consumeWhile", () => {
		const s = new Source(`aaaabb333`);
		expect(s.consumeWhile((c) => c === "a" || c === "b")).toBe("aaaabb");
		expect(s.next()).toBe("3");

		const s2 = new Source(`aaaabb333`);
		expect(s2.consumeWhile((c) => c !== "3")).toBe("aaaabb");
		expect(s2.peekNextCharacters()).toBe("333");
		expect(s2.consumeWhile(() => true)).toBe("333");
		expect(s2.index).toBe(s.text.length);
		expect(() => s2.next()).toThrowError();
	});


});
