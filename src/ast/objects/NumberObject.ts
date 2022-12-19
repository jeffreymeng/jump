import JumpObject from "./JumpObject";

export default abstract class NumberObject extends JumpObject {
	protected constructor(value: number) {
		super(value);
	}
	// progress, not perfection
	// tackle challenges head on
	abstract add(n: NumberObject): NumberObject;
}