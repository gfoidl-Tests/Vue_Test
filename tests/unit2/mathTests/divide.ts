import Math from "@svc/math";
//-----------------------------------------------------------------------------
describe("Math.divide", () => {
    test("args given -> correct quotient", () => {
        const actual = Math.Instance.divide(10, 2);

        expect(actual).toBe(5);
    });
    //-------------------------------------------------------------------------
    test("divisor is 0 -> throws RangeError", () => {
        const a = 1;
        const b = 0;

        expect(() => Math.Instance.divide(a, b)).toThrowError(RangeError);
    });
});
