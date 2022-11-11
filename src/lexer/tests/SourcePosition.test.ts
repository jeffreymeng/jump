import { describe, test, expect } from "@jest/globals";
import SourcePosition from "../SourcePosition";

describe("getLine()", () => {
	const basicSource = `let x = 23 + 12\nreturn 1 + x`;
	test("Basic Cases", () => {
		expect(new SourcePosition(basicSource, 5).getLine()).toBe(1);
		expect(new SourcePosition(basicSource, 19).getLine()).toBe(2);
	});

	test("Start and end of lines", () => {
		expect(new SourcePosition(basicSource, 0).getLine()).toBe(1);
		expect(new SourcePosition(basicSource, 15).getLine()).toBe(1);
		expect(new SourcePosition(basicSource, 16).getLine()).toBe(2);
		expect(new SourcePosition(basicSource, 19).getLine()).toBe(2);
		expect(new SourcePosition(basicSource, 27).getCol()).toBe(12);
	});
});

describe("getCol()", () => {
	const basicSource = `let x = 23 + 12\nreturn 1 + x`;
	test("Basic Cases", () => {
		expect(new SourcePosition(basicSource, 5).getCol()).toBe(6);
		expect(new SourcePosition(basicSource, 18).getCol()).toBe(3);
	});

	test("Start and end of lines", () => {
		expect(new SourcePosition(basicSource, 0).getCol()).toBe(1);
		expect(new SourcePosition(basicSource, 15).getCol()).toBe(16);
		expect(new SourcePosition(basicSource, 16).getCol()).toBe(1);
		expect(new SourcePosition(basicSource, 19).getCol()).toBe(4);
		expect(new SourcePosition(basicSource, 27).getCol()).toBe(12);
	});
});

describe("toString()", () => {
	const basicSource = `let x = 23 + 12\nreturn 1 + x`;
	test("Basic Cases", () => {
		expect(new SourcePosition(basicSource, 5).toString()).toBe("L1:6");
		expect(new SourcePosition(basicSource, 18).toString()).toBe("L2:3");
	});
});
