const injectInfo = {pages: ["pages/index/index","pages/logs/logs","pages/secondPage/index"], namespace: "b" }
;
 // 做不到完全隔离，比如 globalThis(相当于浏览器环境的window，下面的属性可以直接访问的，相当于是全局变量) 中的属性：getCurrentPages
// 除非改写所有的方法，暂不处理，可能没有这个必要性

const intercept = require('./interceptor');
const {storageMethods, routerMethods} = require("./aux");

// injectInfo: pages、namespace
function Runtime(injectInfo) {
    // 每个应用都是独立的
    const globalThisObj = Object.create(globalThis || null);
    const globalObj = Object.create(global || null);
    let app = {};

    const {namespace} = injectInfo
    return {
        global: globalObj,
        globalThis: globalThisObj,
        App: function (options) {
            if (!namespace) { // 主应用直接调用 App
                App(options)
            } else { // 子应用
                intercept.registerLifecycle(options);
            }
            Object.assign(app, options)
        },
        getApp: function () {
            return app;
        },
        getWx: function () {
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

module.exports = new Runtime(injectInfo);