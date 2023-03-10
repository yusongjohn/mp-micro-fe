module.exports = function (appsConfig, finalAppJson) {
    const mainAppJson = appsConfig[0].appJson
    const mainAppPermission = {...mainAppJson.permission}

    const res = {}
    const subApps = appsConfig.filter(appConfig => appConfig.namespace);
    subApps.forEach(function (subApp) {
        const subAppJsonPermission = subApp.appJson.permission || {};
        for (let key in subAppJsonPermission) {
            res[key] = subAppJsonPermission[key];
        }
    })

    finalAppJson.permission = {
        ...res,
        ...mainAppPermission // the main app's permission has higher priority
    };
}