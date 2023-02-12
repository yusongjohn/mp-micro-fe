const intercept = require("./interceptor");
const {routerMethods, storageMethods} = require("./aux");

// Logical layer's top object, equivalent to window object in the browser
const logicGlobal = (Function("return this")())

// injectInfo: pages、namespace
module.exports = function Runtime(injectInfo) {
    // Each application is independent
    const globalThisObj = {};
    const globalObj = {};

    // The child application's app object, the main application is still set and processed via App and getApp
    let app = {};

    const {namespace} = injectInfo
    return {
        logicGlobal,
        global: globalObj,
        globalThis: globalThisObj,
        App: function (options) {
            // main app
            if (!namespace) {
                return App(options)
            }
            // sub app
            intercept.registerLifecycle(options);
            Object.assign(app, options)

        },
        getApp: function () {
            // main app
            if (!namespace) {
                return getApp({allowDefault: true})
            }
            // sub app
            return app;

        },
        getWx: function () {
            if (!namespace) {
                return wx;
            }
            const proxyWx = {};
            const proxyMethods = [...routerMethods, ...storageMethods];
            proxyMethods.handler = function (key, rest) {
                if (routerMethods.includes(key)) {
                    routerMethods.handler(key, rest, injectInfo)
                } else if (storageMethods.handler) {
                    storageMethods.handler(key, rest, injectInfo)
                }
            }
            return intercept.interceptMethods(proxyWx, proxyMethods, injectInfo);
        }
    }
}