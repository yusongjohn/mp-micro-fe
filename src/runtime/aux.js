const routerMethods = [
    'reLaunch',
    'redirectTo',
    'navigateTo',
];

// 数据缓存：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html
// 所有参数中涉及key的应该需要通过命名空间隔离
const storageMethods = [
    'setStorageSync',
    'getStorageSync',
    'removeStorageSync',
    'clearStorageSync',

    'setStorage',
    'getStorage',
    'removeStorage',
    'clearStorage',
    // 'getStorageInfoSync',
    // 'getStorageInfo',
];

routerMethods.handler = function (methodName, rest, injectInfo) {
    const routerInfo = rest[0];
    let url = routerInfo && routerInfo.url; // 上面路由的三个方法都有一个入参，包含url属性
    url = url.slice(1);
    const pages = injectInfo.pages || [];
    if (url && pages.includes(`${url}`)) { // 只处理当前应用自己的跳转
        routerInfo.url = `/${injectInfo.namespace}/${url}`;
    }
}

// If the developer pays attention to the naming rules, they don't have to, and I prefer not to
storageMethods.handler = function (methodName, rest, injectInfo) {
    // TODO In order to prevent cached data from colliding, the key of cached data should be handled
    // ["setStorageSync", "getStorageSync", "removeStorageSync", "clearStorageSync"]
    // ["setStorage", "getStorage", "removeStorage", "clearStorage"]
    if (methodName === 'setStorageSync') {
        console.log('storageMethods', key, rest)
    }

    // clearStorage must also be completely rewritten. Otherwise, other applications will be affected
}

module.exports = {
    // https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html
    appLifecycles: {
        onShow: 'onAppShow',
        onHide: 'onAppHide',
        onError: 'onError',
        onPageNotFound: 'onPageNotFound',
        onUnhandledRejection: 'onUnhandledRejection',
        onThemeChange: 'onThemeChange',
    },
    routerMethods,
    storageMethods
}