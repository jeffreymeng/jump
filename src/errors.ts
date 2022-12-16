import SourcePosition from "./lexer/SourcePosition";
import JumpObject from "./ast/objects/JumpObject";

export class JumpError extends Error {
	constructor(message: string) {
		super(message);
	}
}

/**
 * An error in the syntax of the input.
 */
export class JumpSyntaxError extends JumpError {
	public readonly position: SourcePosition;

	constructor(message: string, position: SourcePosition) {
		super(message + "\n\tat " + position.toString());
		this.position = position;
	}
}

// TODO: track position (add position property to each ast node)
export class JumpTypeError extends JumpError {
	// public readonly position: SourcePosition;

	constructor(message: string) {
		super(message);
		// this.position = position;
	}
}

// TODO: track position (add position property to each ast node)
export class JumpNameError extends JumpError {
	// public readonly position: SourcePosition;

	constructor(message: string) {
		super(message);
		// this.position = position;
	}
}

/**
 * Thrown if the provided arguments are invalid in either quantity or
 * value (but not type).
 */
export class JumpArgumentError extends JumpError {
	// public readonly position: SourcePosition;

	constructor(message: string) {
		super(message);
		// this.position = position;
	}
}

export class JumpInternalError extends JumpError {
	constructor(message: string) {
		super(message);
	}
}

export class JumpDivisionByZeroError extends JumpError {
	constructor(dividend: number, public readonly position: SourcePosition) {
		super(`JumpDivisionByZeroError: Cannot divide ${dividend} by zero.`);
	}
}

// not a real error, but we use the error mechanism to get the return value up.
export class JumpReturn extends Error {
	constructor(public readonly returnValue: any = null /*JumpObject (TODO)*/) {
		super("<jump return>");
	}
}
