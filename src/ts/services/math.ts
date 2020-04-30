export default class Math {
    private static _instance: Math = new Math;
    //-------------------------------------------------------------------------
    static get Instance(): Math {
        return Math._instance;
    }
    //-------------------------------------------------------------------------
    public add(a: number, b: number): number {
        if (a === Number.MAX_SAFE_INTEGER + 1 || b === Number.MAX_SAFE_INTEGER + 1)
            throw new RangeError("Summand(s) must not be MAX_SAFE_INTEGER (or greater)");

        return a + b;
    }
    //-------------------------------------------------------------------------
    public subtract(a: number, b: number): number {
        return a - b;
    }
    //-------------------------------------------------------------------------
    public multiply(a: number, b: number): number {
        return a * b;
    }
    //-------------------------------------------------------------------------
    public divide(a: number, b: number): number {
        if (b === 0) throw RangeError("Divisor must not be 0");

        return a / b;
    }
}
