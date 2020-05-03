test("dummy", () => {
    expect(1).toBe(1);
});
//-----------------------------------------------------------------------------
describe("Google", () => {
    beforeAll(async () => {
        await page.goto("https://google.com");
    });
    //-------------------------------------------------------------------------
    test("should display 'google' text on page", async () => {
        await expect(page).toMatch("google");
    });
    //-------------------------------------------------------------------------
    test("should be titled 'Google'", async () => {
        await expect(page.title()).resolves.toMatch("Google");
    });
    //-------------------------------------------------------------------------
    test("navigate to bing", async () => {
        await page.goto("https://bing.com");
        await expect(page).toMatch("bing");
    });
});
