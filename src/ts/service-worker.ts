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
self.addEventListener("push", event => {
    const notificationPromise = self.registration.showNotification("Vue Test", {
        icon: "calculator.png",
        body: event.data?.text()
    });

    event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", event => {
    console.log("Notification clicked");

    const promise = self.clients.matchAll().then(clients => {
        // Check if at least one client is already open
        if (clients.length) {
            const windowClient = clients[0] as WindowClient;
            windowClient.focus();
        } else {
            self.clients.openWindow("/");
        }
    });

    event.waitUntil(promise);
});
