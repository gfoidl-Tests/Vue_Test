describe("App Start", () => {
    const baseUrl = "http://localhost:8080";
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    test("page title is 'Vue Test'", async () => {
        await expect(page.title()).resolves.toMatch("Vue Test");
    })
});
