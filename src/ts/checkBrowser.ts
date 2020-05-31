function checkBrowserSupport() {
    window.removeEventListener("load", checkBrowserSupport);

    // use var instead of const, to support oldest browser too
    var supportedBrowsers = /((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(13[_\.]0|13[_\.]([1-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})[_\.]\d+)(?:[_\.]\d+)?)|(OperaMini(?:\/att)?\/?(\d+)?(?:\.\d+)?(?:\.\d+)?)|(Opera\/.+Opera Mobi.+Version\/(46\.0|46\.([1-9]|\d{2,})|(4[7-9]|[5-9]\d|\d{3,})\.\d+))|(Opera\/(46\.0|46\.([1-9]|\d{2,})|(4[7-9]|[5-9]\d|\d{3,})\.\d+).+Opera Mobi)|(Opera Mobi.+Opera(?:\/|\s+)(46\.0|46\.([1-9]|\d{2,})|(4[7-9]|[5-9]\d|\d{3,})\.\d+))|(SamsungBrowser\/(9\.2|9\.([3-9]|\d{2,})|([1-9]\d|\d{3,})\.\d+|10\.1|10\.([2-9]|\d{2,})|(1[1-9]|[2-9]\d|\d{3,})\.\d+))|(Edge\/(79(?:\.0)?|79(?:\.([1-9]|\d{2,}))?|([8-9]\d|\d{3,})(?:\.\d+)?))|(HeadlessChrome((?:\/64\.0\.\d+)?|(?:\/64\.([1-9]|\d{2,})\.\d+)?|(?:\/(6[5-9]|[7-9]\d|\d{3,})\.\d+\.\d+)?))|((Chromium|Chrome)\/(64\.0|64\.([1-9]|\d{2,})|(6[5-9]|[7-9]\d|\d{3,})\.\d+)(?:\.\d+)?)|(Version\/(12\.0|12\.([1-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})\.\d+|13\.0|13\.([1-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})\.\d+)(?:\.\d+)? Safari\/)|(Firefox\/(68\.0|68\.([1-9]|\d{2,})|(69|[7-9]\d|\d{3,})\.\d+)\.\d+)|(Firefox\/(68\.0|68\.([1-9]|\d{2,})|(69|[7-9]\d|\d{3,})\.\d+)(pre|[ab]\d+[a-z]*)?)/;

    if (!supportedBrowsers.test(navigator.userAgent)) {
        var notSupportedBrowserInfo = document.getElementById("notSupportedBrowserInfo");
        if (notSupportedBrowserInfo) {
            notSupportedBrowserInfo.style.removeProperty("display");
        }

        console.debug("Browser not supported");
    } else {
        console.debug("Browser supported");
    }
}
//-----------------------------------------------------------------------------
window.addEventListener("load", checkBrowserSupport);
