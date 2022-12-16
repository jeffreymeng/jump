import { describe, expect, test } from "@jest/globals";
import { execOutput } from "./execLine";

describe("Functions", () => {
	test("that are empty can be created and called", () => {
		expect(
			execOutput(`
			void noop() {
				
			}
			noop();
			noop();
		`)
		).toStrictEqual([]);
	});

	test("with no arguments can be used", () => {
		expect(
			execOutput(`
			int getRandomNumber() {
				return 4;
			}
			print(getRandomNumber());
			print(getRandomNumber() * 2);
		`)
		).toStrictEqual(["4", "8"]);
	});

	test("can be anonymous and assigned to a variable", () => {
		expect(
			execOutput(`
			((int, int) => int) add = int (int x, int y) {
				return x + y;
			}
			print(add(3, 4));
		`)
		).toStrictEqual(["7"]);
	});

	test("can be anonymous and immediately invoked", () => {
		expect(
			execOutput(`
			int result = (int (int x, int y) {
				return x + y;
			})(9, 10)
			print(result);
		`)
		).toStrictEqual(["19"]);
	});

	test("can be lambdas", () => {
		expect(
			execOutput(`
			((int, int) => int) subtract = (int x, int y) => x - y;
			print(subtract(10, 8);
		`)
		).toStrictEqual(["2"]);
	});

	test("can be called with arguments and return nothing", () => {
		expect(
			execOutput(`
			void printTwiceOf(int x) {
				print(x * 2);
			}
			printTwiceOf(5);
			printTwiceOf(10 / 5);
		`)
		).toStrictEqual(["10", "4"]);
	});

	test("can be called with arguments and return meaningful values", () => {
		expect(
			execOutput(`
			int addOrSubtract(int x, int y, bool add) {
				if (add) {
					return x + y;
				} else {
					return x - y;
				}
			}
			print(addOrSubtract(5, 6, true));
			print(addOrSubtract(5, 6, false));
		`)
		).toStrictEqual(["11", "-1"]);
	});

	test("can be composed", () => {
		expect(
			execOutput(`
				int add(int x, int y) {
					return x + y;
				}
				int square(int x) {
					return x * x;
				}
				int addSquares(int x, int y) {
					return add(square(x), square(y));
				}
				print(addSquares(3, 4));
				print(addSquares(5, 2));
				print(addSquares(-3, 4));
		`)
		).toStrictEqual(["25", "29", "25"]);
	});

	test("close over local variables", () => {
		expect(
			execOutput(`
			int x = 10;
			int myFunction() {
				int x = 3;
				return x;
			}
			print(myFunction());
			x = 20;
			print(myFunction());
		`)
		).toStrictEqual(["3", "3"]);
	});

	test("close over outer variables in scope of definition", () => {
		expect(
			execOutput(`
			int x = 10;
			int myFunction() {
				return x;
			}
			if (true) {
				int x = 20;
				print(myFunction());
			}
		`)
		).toStrictEqual(["10"]);
	});

	test("can be called recursively", () => {
		const fib = (n: number): number =>
			n < 2 ? 1 : fib(n - 1) + fib(n - 2);
		const fibArr = Array(15).fill(null).map((_, i) => fib(i) + "");
		expect(
			execOutput(`
			int fib(int n) {
				if (n == 1 || n == 2) {
					return 1;
				}
			
				return fib(n - 1) + fib(n - 2);
			}
			
			int x = 1;
			
			while (x < 16) {
				print(fib(x));
				x = x + 1;
			}
		`)
		).toStrictEqual(fibArr);
	});
});
