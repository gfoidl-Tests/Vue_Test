import "jest";
import Math from "@svc/math";
//-----------------------------------------------------------------------------
describe("Math.add", () => {
    test("summands given -> correct sum", () => {
        const actual = Math.Instance.add(2, 1);

        expect(actual).toBe(3);
    });
    //-------------------------------------------------------------------------
    test("MaxValue + 1 -> throws RangeError", () => {
        const a = 9007199254740992;
        const b = 1;

        expect(() => Math.Instance.add(a, b)).toThrowError(RangeError);
    });
});
