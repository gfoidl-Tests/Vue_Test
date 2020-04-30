import Math          from "./math";
import { Operation } from "./operations";
//-----------------------------------------------------------------------------
export class Calculator {
    public static calculate(operation: Operation, a: NullableNumber, b: NullableNumber): NullableNumber {
        if (a === null || b === null) {
            return null;
        }

        const math = Math.Instance();
        let result: number;

        switch (operation) {
            case Operation.Add:
                result = math.add(a, b);
                break;
            case Operation.Subtract:
                result = math.subtract(a, b);
                break;
            case Operation.Multiply:
                result = math.multiply(a, b);
                break;
            case Operation.Divide:
                result = math.divide(a, b);
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
