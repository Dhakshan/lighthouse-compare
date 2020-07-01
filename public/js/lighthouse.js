const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const launchChromeAndRunLighthouse = function (url, flags = {}, config = null) {
    return chromeLauncher.launch(flags).then(chrome => {
        flags.port = chrome.port;
        return lighthouse(url, flags, config).then(results => {
            return chrome.kill().then(() => results.lhr)
        });
    });
}
const lighthouseApp = async function (params) {

    const flags = {
        chromeFlags: ['--headless']
    };
    var urlPassed = 0, testResults = [], comparedResults = [];
    var urlResults = [], keyObj1 = {}, keyObj2 = {}, valueObj1 = {}, valueObj2 = {},
        runURLTest = await function () {
            let launch = launchChromeAndRunLighthouse(params.url[urlPassed], flags);
            launch.then(results => {
                console.log("URL Success ::", results.requestedUrl);
                var TTFB, TTI, FCP, FMP, outJson, rAudits = results.audits;
                TTFB = rAudits["time-to-first-byte"].numericValue;
                TTI = rAudits["interactive"].numericValue;
                FCP = rAudits["first-contentful-paint"].numericValue;
                FMP = rAudits["first-meaningful-paint"].numericValue;
                outJson = {
                    "site": results.requestedUrl,
                    "TTFB": TTFB, "TTI": TTI,
                    "FCP": FCP, "FMP": FMP
                };
                testResults.push(outJson);
                runAllURLCompleted();
                urlPassed++;
                if (params.url[urlPassed]) {
                    runURLTest();
                } else {
                    compareUrl();
                    if (typeof params.complete === "function") {
                        params.complete({ urlResults, testResults, comparedResults });
                    }
                }
            });
        }, runAllURLCompleted = function () {
            var TTFB = 0, TTI = 0, FCP = 0, FMP = 0, siteUrl = '';
            for (var i in testResults) {
                let iobj = testResults[i];
                siteUrl = iobj["site"];
                TTFB += iobj["TTFB"]; TTI += iobj["TTI"]; FCP += iobj["FCP"]; FMP += iobj["FMP"];
            }
            var trLen = testResults.length;
            TTFB = TTFB / trLen; TTI = TTI / trLen; FCP = FCP / trLen; FMP = FMP / trLen;

            var urlObj = {
                "site": siteUrl,
                "TTFB": TTFB.toFixed(2),
                "TTI": TTI.toFixed(2),
                "FCP": FCP.toFixed(2),
                "FMP": FCP.toFixed(2)
            };
            urlResults.push(urlObj);
        }, compareUrl = function () {
            if (urlResults[0] && urlResults[1]) {
                for (var i in urlResults[0]) {
                    var url1 = urlResults[0][i];
                    var url2 = urlResults[1][i] || false;
                    if (url2) {
                        if (url1 > url2) {
                            abs_val = (url1 - url2).toFixed(2);
                            degrad_percentage = ((abs_val / url2) * 100).toFixed(2);
                            var cResults = "Budget " + i + " = " + url1 + " breached by " + abs_val + " ms, from Median " + i + " = " + url2 + " and overall degradation = " + degrad_percentage + " %";
                            if(i=="site"){
                                var cResults = "Budget " + i + " = " + url1 + " , from Median " + i + " = " + url2;
                            }
                        } else {
                            cResults = (i + " " + url1 + " passed");
                        }
                        comparedResults.push(cResults);
                        console.log(cResults);
                    }
                }
            } else {
                console.log("urlResults not available!");
            }
        };
    runURLTest();
}


module.exports = {
    init: lighthouseApp
};