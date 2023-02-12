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

// 如果开发者注意命名规则，可以不改写，其实我倾向非必要不改写
storageMethods.handler = function (methodName, rest, injectInfo) {
    // TODO 为了防止缓存数据冲突，应该要对缓存数据的key做处理
    // 比如类似处理
    // ["setStorageSync", "getStorageSync", "removeStorageSync", "clearStorageSync"]
    // ["setStorage", "getStorage", "removeStorage", "clearStorage"]
    if (methodName === 'setStorageSync') {
        console.log('storageMethods', key, rest)
    }

    // clearStorage 也要完全改写，逐个删除，否则会影响其他应用
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