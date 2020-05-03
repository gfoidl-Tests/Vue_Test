module.exports = {
    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    launch: {
        devtools: false,
        headless: process.env.HEADLESS !== "false",
        slowMo  : process.env.SLOWMO
    },
    server: {
        command      : "yarn serve dist --no-clipboard --listen 8080",
        port         : 8080,
        protocol     : "http",
        launchTimeout: 10000
    }
};
