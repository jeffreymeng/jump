import SourcePosition from "../lexer/SourcePosition";

export class JumpInternalError extends Error {

	constructor(message: string) {
		super(message);
	}
}