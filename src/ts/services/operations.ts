export enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide
}
//-----------------------------------------------------------------------------
export function toOperation(value: string): Operation {
    switch (value) {
        case Operation[Operation.Add]:
            return Operation.Add;
        case Operation[Operation.Subtract]:
            return Operation.Subtract;
        case Operation[Operation.Multiply]:
            return Operation.Multiply;
        case Operation[Operation.Divide]:
            return Operation.Divide;
        default:
            throw new Error(`unknown operation: ${value}`);
    }
}
