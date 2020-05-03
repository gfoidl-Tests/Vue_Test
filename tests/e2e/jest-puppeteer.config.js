module.exports = {
    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    launch: {
        devtools: false,
        headless: process.env.HEADLESS !== "false",
        slowMo  : process.env.SLOWMO
    }
};
