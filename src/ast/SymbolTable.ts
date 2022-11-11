import SourcePosition from "../lexer/SourcePosition";
import { JumpInternalError } from "../errors";

export enum SCOPE_TYPE {
	LOOP = "loop",
	FUNCTION = "function",
	GLOBAL = "global",
}

/**
 * Returns a new array with each element in reverse order.
 * @param arr - The array to reverse. This array will not be modified.
 */
function reversed<T>(arr: T[]): T[] {
	const rev = arr.slice();
	rev.reverse();
	return rev;
}

export default class SymbolTable {
	protected table: {
		symbols: Map<
			string,
			{
				type: string;
				value: any;
			}
		>;
		name: string;
		type: SCOPE_TYPE;
		position: SourcePosition;
	}[] = [
		{
			name: "Global",
			type: SCOPE_TYPE.GLOBAL,
			position: new SourcePosition("", 0),
			symbols: new Map(),
		},
	];

	/**
	 * Creates a new scope to add to the table.
	 * @param name - The name of the scope.
	 * @param type - The type of the scope.
	 * @param position - The position of the start of the scope in the source.
	 */
	public pushScope(
		name: string,
		type: SCOPE_TYPE,
		position: SourcePosition
	): void {
		// name: 'Loop 147 @ L13:4'
		// name: 'parse() @ L19:2'
		this.table.push({
			name,
			type,
			position,
			symbols: new Map(),
		});
	}

	/**
	 * Exits the topmost scope of the stack, removing any values stored in that scope.
	 */
	public exitScope(): void {
		if (this.table.length <= 1) {
			throw new JumpInternalError("Cannot exit the global scope!");
		}
		this.table.pop();
	}

	/**
	 * Check if a symbol with a given identifier exists.
	 * @param id - The identifier of the variable.
	 */
	public has(id: string) {
		return reversed(this.table).some((table) => table.symbols.has(id));
	}

	/**
	 * Declare a variable. The variable must not already exist.
	 * @param id - The identifier of the variable.
	 * @param type - The type of the variable. Types are not checked in the symbol table.
	 * @param value - The value of the variable.
	 */
	public declare(id: string, type: string, value: any): void {
		if (this.table.at(-1)!.symbols.has(id)) {
			throw new JumpInternalError(
				`Identifier '${id}' has already been declared.`
			);
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.table.at(-1)!.symbols.set(id, {
			type,
			value,
		});
	}

	/**
	 * Update a variable. The variable must already exist.
	 * @param id - The identifier of the variable.
	 * @param value - The new value of the variable.
	 */
	public update(id: string, val: any) {
		for (const table of reversed(this.table)) {
			if (table.symbols.has(id)) {
				table.symbols.set(id, {
					...table.symbols.get(id)!,
					value: val,
				});
				return;
			}
		}
		throw new JumpInternalError(
			`Unable to update identifier '${id}' because it was not found in the symbol table.`
		);
	}

	/**
	 * Gets the type and value of a variable. The variable must already exist.
	 * @param id - The identifier of the variable.
	 */
	public get(id: string): { type: string; value: any } {
		for (const table of reversed(this.table)) {
			if (table.symbols.has(id)) {
				return table.symbols.get(id)!;
			}
		}
		throw new JumpInternalError(
			`Unable to get identifier '${id}' because it was not found in the symbol table.`
		);
	}
}
