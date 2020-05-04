/**
 * Provides elementary math operations.
 *
 * @remarks
 * It is very simple, as it's just a demo.
 */
export default class Math {
    private static _instance: Math = new Math;
    //-------------------------------------------------------------------------
    static get Instance(): Math {
        return Math._instance;
    }
    //-------------------------------------------------------------------------
    /**
     * Adds two given numbers `a` and `b`.
     *
     * @param a - The first summand
     * @param b - The second summand
     * @returns `a + b`
     *
     * @remarks Arguments are validated to guard against overflow, and in case of
     * a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError}  is thrown.
     */
    public add(a: number, b: number): number {
        if (a === Number.MAX_SAFE_INTEGER + 1 || b === Number.MAX_SAFE_INTEGER + 1)
            throw new RangeError("Summand(s) must not be MAX_SAFE_INTEGER (or greater).");

        return a + b;
    }
    //-------------------------------------------------------------------------
    /**
     * Subtracts `b` from `a`.
     *
     * @param a - First argument.
     * @param b - Second argument.
     * @returns `a - b`
     */
    public subtract(a: number, b: number): number {
        return a - b;
    }
    //-------------------------------------------------------------------------
    /**
     * Multiplies `a` and `b`.
     *
     * @param a - First argument.
     * @param b - Second argument.
     * @returns `a * b`
     */
    public multiply(a: number, b: number): number {
        return a * b;
    }
    //-------------------------------------------------------------------------
    /**
     * Divides `a` and `b`.
     *
     * @param a - Dividend
     * @param b - Divisor
     * @returns `a / b`
     *
     * @remarks If `b == 0` a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError}
     * is thrown.
     */
    public divide(a: number, b: number): number {
        if (b === 0) throw RangeError("Divisor must not be 0.");

        return a / b;
    }
}
