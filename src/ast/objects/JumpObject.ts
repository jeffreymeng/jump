import Operator from "./Operator";

export default abstract class JumpObject {
	public readonly value: any;
	protected constructor(value: any) {
		this.value = value;
	}

	protected operator(operator: Operator) {

	}
}
