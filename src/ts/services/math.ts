export default class Math {
    private static _instance: Math = new Math;
    //-------------------------------------------------------------------------
    public static Instance(): Math {
        return Math._instance;
    }
    //-------------------------------------------------------------------------
    public add(a: number, b: number): number {
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
        if (b === 0) throw RangeError("divisor can't be 0");

        return a / b;
    }
}
