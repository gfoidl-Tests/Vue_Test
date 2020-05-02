import "tsconfig-paths/register";
import Math                                    from "@svc/math";
import { TestFixture, TestCase, Test, Expect } from "alsatian";
//-----------------------------------------------------------------------------
@TestFixture()
export class Math_Divide_Tests {
    @TestCase(0, 1, 0)
    @TestCase(10, 2, 5)
    public Args_given___correct_quotient(a: number, b: number, res: number): void {
        const actual = Math.Instance.divide(a, b);

        Expect(actual).toBe(res);
    }
    //-------------------------------------------------------------------------
    @Test()
    public Divisor_is_0___throws_RangeError(): void {
        Expect(() => Math.Instance.divide(1, 0)).toThrowError(RangeError, "Divisor must not be 0");
    }
}
