const {appLifecycles} = require("./aux");

module.exports = {
    interceptMethods: function (proxyWx, proxyMethods) {
        const handler = proxyMethods.handler
        return new Proxy(proxyWx, {
            get(target, key, receive) {
                const originHandler = wx[key];
                if (proxyMethods.includes(key)) {
                    return function (...rest) {
                        handler(key, rest);
                        return originHandler(...rest)
                    }
                } else {
                    return originHandler;
                }
            }
        })
    },
    registerLifecycle(options) {
        if (!options) {
            return
        }
        const launchOptions = wx.getLaunchOptionsSync();

        if (options.onLaunch) {
            options.onLaunch(launchOptions)
        }

        Object.keys(appLifecycles).forEach((lifecycleName) => {
            const wxListenMethod = wx[appLifecycles[lifecycleName]];
            const lifecycleHandler = options[lifecycleName];
            if (typeof lifecycleHandler === 'function') {
                wxListenMethod(lifecycleHandler);
            }
        });
    }
}