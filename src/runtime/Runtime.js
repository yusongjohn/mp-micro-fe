const intercept = require("./interceptor");
const {routerMethods, storageMethods} = require("./aux");

const logicGlobal = (Function("return this")())

// injectInfo: pages、namespace
module.exports = function Runtime(injectInfo) {
    // 每个应用都是独立的
    const globalThisObj = {};
    const globalObj = {};
    let app = {}; // 子应用的app对象，主应用依然通过App和getApp()设置和处理

    const {namespace} = injectInfo
    return {
        logicGlobal, // 逻辑层顶层对象，相当于浏览器中的window
        global: globalObj,
        globalThis: globalThisObj,
        App: function (options) {
            // 主应用直接调用 App
            if (!namespace) {
                return App(options)
            }
            // 子应用
            intercept.registerLifecycle(options);
            Object.assign(app, options)

        },
        getApp: function () {
            // 主应用
            if (!namespace) {
                return getApp({allowDefault: true})
            }
            // 子应用
            return app;

        },
        getWx: function () {
            if (!namespace) {
                return wx;
            }
            // const proxyWx = {...wx} // 如果不支持Proxy，则只能逐个拷贝
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