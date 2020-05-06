// In headless mode service worker are disabled by default. So startup the
// browser manually and not via jest-puppeteer.
//-----------------------------------------------------------------------------
import * as puppeteer from "puppeteer";
//-----------------------------------------------------------------------------
describe("Service Worker", () => {
    const baseUrl = "http://localhost:8080/";
    let browser   : puppeteer.Browser;
    let myPage    : puppeteer.Page;
    const messages: string[] = [];
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        browser = await puppeteer.launch({
            args             : ["--enable-features=NetworkService"],
            headless         : true,
            //headless         : false,
            //slowMo           : 250,
            ignoreHTTPSErrors: true
        });

        myPage = await browser.newPage();

        myPage.on("console", msg => {
            const text = msg.text();
            console.log("[PAGE LOG] ", text);
            messages.push(text);
        });

        await myPage.goto(baseUrl);

        // Let the service worker work
        await myPage.waitFor(1000);
    });
    //-------------------------------------------------------------------------
    afterAll(async () => {
        await myPage .close();
        await browser.close();
    });
    //-------------------------------------------------------------------------
    test("console log has note about SW registration", () => {
        let hasMatch = false;

        for (const msg of messages) {
            if (msg.match(/SW registered/)) {
                hasMatch = true;
                break;
            }
        }

        expect(hasMatch).toBe(true);
    });
    //-------------------------------------------------------------------------
    test("browser goes offline, page reload -> OK", async () => {
        expect(myPage.url()).toBe(baseUrl);

        try {
            await myPage.setOfflineMode(true);
            await myPage.reload();

            expect(myPage.url()).toBe(baseUrl);
        } finally {
            await myPage.setOfflineMode(false);
        }
    });
});
