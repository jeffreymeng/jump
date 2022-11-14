import SourcePosition from "./lexer/SourcePosition";

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
		super(message);
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
