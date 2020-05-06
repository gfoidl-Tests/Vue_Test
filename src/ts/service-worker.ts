import { skipWaiting, clientsClaim }               from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
//-----------------------------------------------------------------------------
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
skipWaiting();
clientsClaim();

// Let workbox clean-up the cache storage
cleanupOutdatedCaches();

// Mandatory for workbox plugin to set the assets to cache
precacheAndRoute(self.__WB_MANIFEST);
