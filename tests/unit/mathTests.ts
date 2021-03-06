import Math from "@svc/math";
//-----------------------------------------------------------------------------
describe("Math", () => {
    describe("add", () => {
        test("summands given -> correct sum", () => {
            const actual = Math.Instance.add(2, 1);

            expect(actual).toBe(3);
        });
        //---------------------------------------------------------------------
        test.each`
            a   | b    | expected
           ${0} | ${0} | ${0}
           ${1} | ${2} | ${3}
           ${2} | ${1} | ${3}
        `("summands given -> correct sum", ({ a, b, expected }) => {
            const actual = Math.Instance.add(a, b);

            expect(actual).toBe(expected);
        });
        //---------------------------------------------------------------------
        test.each([
            [9007199254740992, 1],
            [1, 9007199254740992]
        ])("MaxValue + 1 -> throws RangeError", (a, b) => {
            expect(() => Math.Instance.add(a, b)).toThrowError(RangeError);
        });
    });
    //-------------------------------------------------------------------------
    describe("Math.divide", () => {
        test.each`
          a    | b    | expected
         ${0}  | ${1} | ${0}
         ${10} | ${2} | ${5}
      `("summands given -> correct sum", ({ a, b, expected }) => {
            const actual = Math.Instance.divide(a, b);

            expect(actual).toBe(expected);
        });
        //---------------------------------------------------------------------
        test("divisor is 0 -> throws RangeError", () => {
            expect(() => Math.Instance.divide(1, 0)).toThrowError(RangeError);
        });
    });
});
