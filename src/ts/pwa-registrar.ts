export default class PwaRegistrar {
    public static async run(): Promise<void> {
        window.addEventListener("load", async () => {
            await PwaRegistrar.registerWorker();
        });
    }
    //-------------------------------------------------------------------------
    private static async registerWorker(): Promise<void> {
        if ("serviceWorker" in navigator) {
            try {
                const registration = await navigator.serviceWorker.register("sw.js");
                PwaRegistrar.logInfo("sw registered", registration);
            } catch (e) {
                PwaRegistrar.logError("registration failed", e);
            }
        } else {
            PwaRegistrar.logInfo("not supported");
        }
    }
    //-------------------------------------------------------------------------
    private static logInfo(message: string, ...additionalParameters: any[]): void {
        PwaRegistrar.logCore("info", message, ...additionalParameters);
    }
    //-------------------------------------------------------------------------
    private static logError(message: string, ...additionalParameters: any[]): void {
        PwaRegistrar.logCore("error", message, ...additionalParameters);
    }
    //-------------------------------------------------------------------------
    private static logCore(method: "info" | "error", message: string, ...additionalParameters: object[]): void {
        // JS objects are "dictionaries"
        console[method]("%c[SW] ", `
            margin          : 1px;
            font-weight     : bold;
            background-color: #0094ff;
            color           : #fe4444
        `, message, ...additionalParameters);
    }
}
