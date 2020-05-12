import { skipWaiting, clientsClaim }               from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
//-----------------------------------------------------------------------------
// Hint what `self` actually is.
declare const self: ServiceWorkerGlobalScope;
//export { };       // here not needed, as the imports make it already a module
//-----------------------------------------------------------------------------
function setupCachingCore() {
    // Let workbox clean-up the cache storage
    cleanupOutdatedCaches();

    // Mandatory for workbox plugin to set the assets to cache
    precacheAndRoute(self.__WB_MANIFEST);
}
//-----------------------------------------------------------------------------
function setupCaching() {
    const navigator = self.navigator;

    if ("connection" in navigator) {
        const connection = navigator.connection;
        console.log("connection info: ", connection);

        if (connection.type === ConnectionType.cellular || connection.effectiveType === EffectiveConnectionType["slow-2g"]) {
            console.debug("network connection is slow, don't setup caching");
        } else {
            console.debug("network connection is fast enough, setting up caching");
            setupCachingCore();
        }
    } else {
        console.debug("no connection info available, setting up caching regardless quota");
        setupCachingCore();
    }
}
//-----------------------------------------------------------------------------
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
skipWaiting();
clientsClaim();

setupCaching();
