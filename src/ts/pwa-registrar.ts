export default class PwaRegistrar {
    public static async run(): Promise<void> {
        window.addEventListener("load", async () => {
            const registration = await PwaRegistrar.registerWorker();
            const permission   = await PwaRegistrar.checkPushNotifications();

            if (registration !== null && permission === "granted") {
                await navigator.serviceWorker.ready;

                // This notification will be shown in the OS' notification bar
                // https://developers.google.com/web/fundamentals/push-notifications
                registration.showNotification("Vue Test", {
                    icon: "calculator.png",
                    body: `Started Calculator (Vue Test) at ${new Date().toLocaleString()}`,
                });
            }

            // Handler for "worker" messages. Keep in mind that a service worker is
            // based on normal workers.
            navigator.serviceWorker.addEventListener("message", event => {
                console.dir(event.data);
            });
        });
    }
    //-------------------------------------------------------------------------
    private static async registerWorker(): Promise<ServiceWorkerRegistration | null> {
        if ("serviceWorker" in navigator) {
            try {
                const registration = await navigator.serviceWorker.register("sw.js");
                PwaRegistrar.logInfo("sw registered", registration);

                return registration;
            } catch (e) {
                PwaRegistrar.logError("registration failed", e);
            }
        } else {
            PwaRegistrar.logInfo("not supported");
        }

        return null;
    }
    //-------------------------------------------------------------------------
    private static async checkPushNotifications(): Promise<NotificationPermission | null> {
        if ("PushManager" in window) {
            PwaRegistrar.logInfo("push notifications supported");

            try {
                const permission = await window.Notification.requestPermission();
                PwaRegistrar.logInfo("requested permission", permission);

                return permission;
            } catch (e) {
                PwaRegistrar.logError("request permission failed", e);
            }
        } else {
            PwaRegistrar.logInfo("push notifications not supported");
        }

        return null;
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
