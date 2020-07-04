var isMobile = false;

var config = function () {
    var obj = {
        desktop: {
            extends: 'lighthouse:default',
            settings: {
                maxWaitForFcp: 15 * 1000,
                maxWaitForLoad: 35 * 1000,
                emulatedFormFactor: 'desktop',
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10 * 1024,
                    cpuSlowdownMultiplier: 1,
                },
                'throttlingMethod': 'simulate',
                skipAudits: ['uses-http2'],
            },
        },
        mobile : {
            extends: 'lighthouse:default',
            settings: {
                maxWaitForFcp: 15 * 1000,
                maxWaitForLoad: 35 * 1000,
                skipAudits: ['uses-http2'],
            },
            audits: [
                'metrics/first-contentful-paint-3g',
            ],
            categories: {
                performance: {
                    auditRefs: [
                        { id: 'first-contentful-paint-3g', weight: 0 },
                    ],
                },
            },
        }
    }
    return obj;
};

module.exports = config;
