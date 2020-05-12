import Helper from "./helper";
//-----------------------------------------------------------------------------
describe("Storage in DB", () => {
    const baseUrl = "http://localhost:8080/";
    //-------------------------------------------------------------------------
    beforeEach(async () => {
        // Uncomment for better debugging
        //page.on("console", msg => {
        //    const text = msg.text();
        //    console.log("[PAGE LOG] ", text);
        //});

        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    afterEach(async () => {
        await jestPuppeteer.resetBrowser();
    });
    //-------------------------------------------------------------------------
    test("calculation -> inputs stored to db", async () => {
        // See https://github.com/smooth-code/jest-puppeteer/tree/master/packages/expect-puppeteer#why-do-i-need-it
        // for reason why jest-puppeteer is useful.

        // jest-puppeteer
        await expect(page).toFill("#input-a", "3");

        // pure puppeteer (long version)
        //const inputB = await expect(page).toMatchElement("#input-b");
        //await inputB.focus();
        //await page.keyboard.type("4");

        // pure puppeteer (short version)
        await page.type("#input-b", "4");

        // pure puppeteer
        //const inputOp = await expect(page).toMatchElement("#input-op");
        //await inputOp.select("Subtract");
        // jest-puppeteer
        await expect(page).toSelect("#input-op", "Multiply");

        // pure puppeteer
        //await page.click("#calcButton");
        // jest-puppeteer
        await expect(page).toClick("#calcButton");

        await Helper.takeScreenshot("db-storage_form-filled.png", page);

        const count = await Helper.checkCountOfInputStore(page);
        expect(count).toBe(1);
    });
    //-------------------------------------------------------------------------
    test("reset after calculation -> inputs cleared in db", async () => {
        await expect(page).toFill("#input-a", "3");
        await expect(page).toFill("#input-b", "4");
        await expect(page).toSelect("#input-op", "Multiply");
        await expect(page).toClick("#calcButton");

        // Wait a little bit, then click reset
        await page.waitFor(250);
        await expect(page).toClick("#resetButton");

        await Helper.takeScreenshot("db-storage_form-reset.png", page);

        const count = await Helper.checkCountOfInputStore(page);
        expect(count).toBe(0);
    });
    //-------------------------------------------------------------------------
    test("page load after previous calculation -> inputs from db are set", async () => {
        await expect(page).toFill("#input-a", "3");
        await expect(page).toFill("#input-b", "4");
        await expect(page).toSelect("#input-op", "Divide");
        await expect(page).toClick("#calcButton");

        // Navigate away, then back
        await page.goto("https://google.at");
        await page.goBack();

        const inputA  = await expect(page).toMatchElement("#input-a");
        const inputB  = await expect(page).toMatchElement("#input-b");
        const inputOp = await expect(page).toMatchElement("#input-op");

        await expect(page.evaluate(el => el.value, inputA)) .resolves.toBe("3");
        await expect(page.evaluate(el => el.value, inputB)) .resolves.toBe("4");
        await expect(page.evaluate(el => el.value, inputOp)).resolves.toBe("Divide");
    });
    //-------------------------------------------------------------------------
    test("fresh page -> calc-db is empty", async () => {
        const count = await Helper.checkCountOfInputStore(page);
        expect(count).toBe(0);
    });
});
