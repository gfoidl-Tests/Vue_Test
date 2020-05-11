import { NullableNumber } from "@svc/calculator";
//-----------------------------------------------------------------------------
export interface Input {
    a        : NullableNumber;
    b        : NullableNumber;
    operation: string;
}
