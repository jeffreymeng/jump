import { JumpInternalError } from "../../errors";
import JumpObject from "./JumpObject";

class IntObject extends JumpObject {
	constructor(value: number) {
		if (value % 1 !== 0) {
			throw new JumpInternalError(
				"IntObject created with non-integer value."
			);
		}
		super(value);
	}

	// TODO: do we do this?
	// SCOPE: for now, just focus on making it so the return type of evaluating
	// is always an object. This way, we can have function objects, boolean objets next.
	// don't do operators yet. Later, we'll refactor so everything is a class.
	// TODO: next: boolean operators, control flow (if, for, while)
	// operators = {
	//	 add: [ don't do this yet ]
	// }
}
