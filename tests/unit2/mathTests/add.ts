import "tsconfig-paths/register";
import Math                              from "@svc/math";
import { TestFixture, TestCase, Expect } from "alsatian";
//-----------------------------------------------------------------------------
@TestFixture()
export class Math_Add_Tests {
    @TestCase(0, 0, 0)
    @TestCase(1, 2, 3)
    @TestCase(2, 1, 3)
    public Summands_given___correct_sum(a: number, b: number, res: number): void {
        const actual = Math.Instance.add(a, b);

        Expect(actual).toBe(res);
    }
    //-------------------------------------------------------------------------
    @TestCase(9007199254740992, 1)
    @TestCase(1, 9007199254740992)
    public MaxValue_plus_1___throws_RangeError(a: number, b: number): void {
        Expect(() => Math.Instance.add(a, b)).toThrowError(RangeError, "Summand(s) must not be MAX_SAFE_INTEGER (or greater).");
    }
}
