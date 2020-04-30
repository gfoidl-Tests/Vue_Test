import Math          from "./math";
import { Operation } from "./operations";
//-----------------------------------------------------------------------------
export class Calculator {
    public static calculate(operation: Operation, a: NullableNumber, b: NullableNumber): NullableNumber {
        if (a === null || b === null) {
            return null;
        }

        let result: number;

        switch (operation) {
            case Operation.Add:
                result = Math.Instance.add(a, b);
                break;
            case Operation.Subtract:
                result = Math.Instance.subtract(a, b);
                break;
            case Operation.Multiply:
                result = Math.Instance.multiply(a, b);
                break;
            case Operation.Divide:
                result = Math.Instance.divide(a, b);
                break;
            default:
                throw new Error("unknown operation");
        }

        return result;
    }
}
//-----------------------------------------------------------------------------
export type NullableNumber = number | null;
//-----------------------------------------------------------------------------
export * from "./operations";
