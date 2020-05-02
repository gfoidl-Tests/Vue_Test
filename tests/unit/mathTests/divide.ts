import Math from "@svc/math";
//-----------------------------------------------------------------------------
describe("Math.divide", () => {
    test.each`
        a    | b    | expected
       ${0}  | ${1} | ${0}
       ${10} | ${2} | ${5}
    `("summands given -> correct sum", ({ a, b, expected }) => {
        const actual = Math.Instance.divide(a, b);

        expect(actual).toBe(expected);
    });
    //-------------------------------------------------------------------------
    test("divisor is 0 -> throws RangeError", () => {
        expect(() => Math.Instance.divide(1, 0)).toThrowError(RangeError);
    });
});
