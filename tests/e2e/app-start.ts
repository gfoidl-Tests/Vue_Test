import Helper      from "./helper";
import { devices } from "puppeteer";
//-----------------------------------------------------------------------------
describe("App Start", () => {
    const baseUrl = "http://localhost:8080";
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    test("page title is 'Vue Test'", async () => {
        await expect(page.title()).resolves.toMatch("Vue Test");
    });
    //-------------------------------------------------------------------------
    test("takes screenshot so it can be stored as artifact", async () => {
        await Helper.takeScreenshot("normal.png");
    });
    //-------------------------------------------------------------------------
    test("scripts started working by chechking the h2-tag", async () => {
        await expect(page).toMatch("Calculator");
    });
    //-------------------------------------------------------------------------
    test("notSupportedBrowserInfo is removed from DOM", async () => {
        await expect(page).not.toMatchElement("#notSupportedBrowserInfo");
    });
    //-------------------------------------------------------------------------
    test("logo on right is loaded", async () => {
        const img  = await expect(page).toMatchElement(".img-logo");
        const src  = await img.getProperty("src");
        const data = await src.jsonValue();

        expect(data).toMatch(/^data:image\/png;base64/);
    });
    //-------------------------------------------------------------------------
    test("display width < 250 -> logo on right not shown", async () => {
        const viewPort = await page.viewport();
        await page.setViewport({ ...viewPort, width: 250 - 1 });
        await Helper.takeScreenshot("small-no-logo.png");

        const img = await expect(page).toMatchElement(".img-logo");
        await expect(Helper.isVisible(img)).resolves.toBe(false);

        // reset viewport to previous value
        await page.setViewport(viewPort);
    });
    //-------------------------------------------------------------------------
    test("emulate devices", async () => {
        try {
            for (const device of devices) {
                await page.emulate(device);
                await Helper.takeScreenshot(`${device.name}.png`, "screenshots/devices");
            }
        } finally {
            await jestPuppeteer.resetPage();
        }
    });
});
