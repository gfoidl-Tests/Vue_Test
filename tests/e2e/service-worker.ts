// In headless mode service worker are disabled by default. So startup the
// browser manually and not via jest-puppeteer.
//-----------------------------------------------------------------------------
import Helper from "./helper";
//-----------------------------------------------------------------------------
describe("Service Worker", () => {
    const baseUrl = "http://localhost:8080/";
    //-------------------------------------------------------------------------
    beforeEach(async () => {
        await page.goto(baseUrl);

        // Let the service worker work
        await page.waitFor(1000);
    });
    //-------------------------------------------------------------------------
    afterEach(async () => {
        // Clean the page, so that the eval-script from the test won't infer
        // with other tests.
        await jestPuppeteer.resetPage();
    });
    //-------------------------------------------------------------------------
    test("service worker is running", async () => {
        // This won't work as the evaluate script must be JS, not TypeScript
        //const swState = await page.evaluate(async () => {
        //    const registration = await window.navigator.serviceWorker.getRegistration();
        //    const activeWorker = registration?.active;
        //    return activeWorker?.state;
        //});
        const swState = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                window.navigator.serviceWorker.getRegistration()
                    .then(registration => {
                        if (!registration) {
                            reject("no sw-registration found");
                        }

                        const activeWorker = registration?.active;
                        resolve(activeWorker?.state);
                    });
            });
        });

        const expectedState: ServiceWorkerState = "activated";
        expect(swState).toBe(expectedState)
    });
    //-------------------------------------------------------------------------
    test("browser goes offline, page reload -> OK", async () => {
        expect(page.url()).toBe(baseUrl);

        try {
            await page.setOfflineMode(true);
            await page.reload();

            await Helper.takeScreenshot("offline.png");

            expect(page.url()).toBe(baseUrl);
            await expect(page).toMatchElement("#input-a");
        } finally {
            await page.setOfflineMode(false);
        }
    });
});
