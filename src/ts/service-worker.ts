import { skipWaiting, clientsClaim }               from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
//-----------------------------------------------------------------------------
// Hint what `self` actually is.
declare const self: ServiceWorkerGlobalScope;
//export { };       // here not needed, as the imports make it already a module
//-----------------------------------------------------------------------------
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
skipWaiting();
clientsClaim();

// Let workbox clean-up the cache storage
cleanupOutdatedCaches();

// Mandatory for workbox plugin to set the assets to cache
precacheAndRoute(self.__WB_MANIFEST);
//-----------------------------------------------------------------------------
async function handlePush(event: PushEvent): Promise<void> {
    // This uncommented block will lead to the following exception:
    //  Failed to execute 'showNotification' on 'ServiceWorkerRegistration': No notification permission has been granted for this origin.
    // So use the code below, which does the job. Note: without the check and when
    // there is no permission, an exception is thrown.
    //const permission = await self.registration.pushManager.permissionState();
    //if (permission !== "granted") {
    //    return;
    //}

    if (Notification.permission !== "granted") {
        console.log("Notification received, but permission to show is not granted.");
        return;
    }

    await self.registration.showNotification("Vue Test", {
        icon   : "calculator.png",
        body   : event.data?.text(),
        actions: [
            {
                action: "open",
                title : "Open app"
            },
            {
                action: "close",
                title : "Close notification"
            }
        ]
    });
}
//-----------------------------------------------------------------------------
async function handleNotificationClicked(event: NotificationEvent): Promise<void> {
    if (!event.action) {
        console.log("Normal notification click");
        return;
    }

    if (event.action === "close") {
        console.log("Notification close clicked");
        event.notification.close();
        return;
    }

    console.log("Notification open clicked");

    const urlToOpen = self.location.href;
    const clients   = await self.clients.matchAll({
        type               : "window",
        includeUncontrolled: true
    });
    const windowClients = clients.map(c => c as Readonly<WindowClient>);
    let matchingClient: WindowClient | null = null;

    for (const windowClient of windowClients) {
        if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
        }
    }

    if (matchingClient) {
        await matchingClient.focus();
    } else {
        await self.clients.openWindow(urlToOpen);
    }

    event.notification.close();
}
//-----------------------------------------------------------------------------
self.addEventListener("push", event => {
    event.waitUntil(handlePush(event));
});
//-----------------------------------------------------------------------------
self.addEventListener("notificationclick", event => {
    event.waitUntil(handleNotificationClicked(event));
});
