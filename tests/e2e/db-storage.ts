import * as puppeteer from "puppeteer";
import Helper         from "./helper";
//-----------------------------------------------------------------------------
describe("Storage in DB", () => {
    const baseUrl = "http://localhost:8080/";
    let browser: puppeteer.Browser;
    let myPage : puppeteer.Page;
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless         : true,
            ignoreHTTPSErrors: true
        });
    });
    //-------------------------------------------------------------------------
    beforeEach(async () => {
        myPage = await browser.newPage();

        // Uncomment for better debugging
        //myPage.on("console", msg => {
        //    const text = msg.text();
        //    console.log("[PAGE LOG] ", text);
        //});

        await myPage.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    afterEach(async () => {
        await myPage.evaluate(() => {
            return new Promise((resolve, reject) => {
                const openRequest = window.indexedDB.open("calc");

                openRequest.onsuccess = () => {
                    const db               = openRequest.result;
                    const transaction      = db.transaction("input", "readwrite");
                    transaction.oncomplete = () => resolve();
                    transaction.onerror    = () => reject(transaction.error);

                    const store        = transaction.objectStore("input");
                    const clearRequest = store.clear();

                    // Not necessary, it's "done" via the transaction. This event is triggered
                    // before the tran completes (as several actions can be grouped by a transaction ;-))
                    clearRequest.onsuccess = () => {
                        console.log("store input cleared");
                    }
                }

                openRequest.onerror = () => {
                    console.error("error opening db", openRequest.error);
                    reject(openRequest.error);
                }
            });
        });

        await myPage.close();
    });
    //-------------------------------------------------------------------------
    afterAll(async () => {
        await browser.close();
    });
    //-------------------------------------------------------------------------
    test("fresh page -> calc-db is empty", async () => {
        const count = await Helper.checkCountOfInputStore(myPage);
        expect(count).toBe(0);
    });
    //-------------------------------------------------------------------------
    test("calculation -> inputs stored to db", async () => {
        // See https://github.com/smooth-code/jest-puppeteer/tree/master/packages/expect-puppeteer#why-do-i-need-it
        // for reason why jest-puppeteer is useful.

        // jest-puppeteer
        await expect(myPage).toFill("#input-a", "3");

        // pure puppeteer (long version)
        //const inputB = await expect(myPage).toMatchElement("#input-b");
        //await inputB.focus();
        //await myPage.keyboard.type("4");

        // pure puppeteer (short version)
        await myPage.type("#input-b", "4");

        // pure puppeteer
        //const inputOp = await expect(myPage).toMatchElement("#input-op");
        //await inputOp.select("Subtract");
        // jest-puppeteer
        await expect(myPage).toSelect("#input-op", "Multiply");

        // pure puppeteer
        //await myPage.click("#calcButton");
        // jest-puppeteer
        await expect(myPage).toClick("#calcButton");

        await Helper.takeScreenshot("db-storage_form-filled.png", myPage);

        const count = await Helper.checkCountOfInputStore(myPage);
        expect(count).toBe(1);
    });
    //-------------------------------------------------------------------------
    test("reset after calculation -> inputs cleared in db", async () => {
        await expect(myPage).toFill("#input-a", "3");
        await expect(myPage).toFill("#input-b", "4");
        await expect(myPage).toSelect("#input-op", "Multiply");
        await expect(myPage).toClick("#calcButton");

        // Wait a little bit, then click reset
        await myPage.waitFor(250);
        await expect(myPage).toClick("#resetButton");

        await Helper.takeScreenshot("db-storage_form-reset.png", myPage);

        const count = await Helper.checkCountOfInputStore(myPage);
        expect(count).toBe(0);
    });
    //-------------------------------------------------------------------------
    test("page load after previous calculation -> inputs from db are set", async () => {
        await expect(myPage).toFill("#input-a", "3");
        await expect(myPage).toFill("#input-b", "4");
        await expect(myPage).toSelect("#input-op", "Divide");
        await expect(myPage).toClick("#calcButton");

        // Navigate away, then back
        await myPage.goto("https://google.at");
        await myPage.goBack();

        const inputA  = await expect(myPage).toMatchElement("#input-a");
        const inputB  = await expect(myPage).toMatchElement("#input-b");
        const inputOp = await expect(myPage).toMatchElement("#input-op");

        await expect(myPage.evaluate(el => el.value, inputA)) .resolves.toBe("3");
        await expect(myPage.evaluate(el => el.value, inputB)) .resolves.toBe("4");
        await expect(myPage.evaluate(el => el.value, inputOp)).resolves.toBe("Divide");
    });
});
