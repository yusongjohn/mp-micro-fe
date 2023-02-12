const {getSubPkgsFromJson} = require('./utils')

function getSubAppPreloadRule(subAppConfig) {
    const namespace = subAppConfig.namespace;
    const oldPreloadRule = subAppConfig.appJson.preloadRule;

    const newPreloadRule = {}
    const subPackages = getSubPkgsFromJson(subAppConfig.appJson);

    // the preloadRule format, see https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html
    for (let oldPagePath in oldPreloadRule) {
        const oldPreloadInfo = oldPreloadRule[oldPagePath];
        // directly change the package name in packages on oldVal
        const preloadPackages = oldPreloadInfo.packages || [];
        oldPreloadInfo.packages = preloadPackages.map(pkgNameOrRoot => {
            const isSubPackageRoot = subPackages.findIndex(pkgInfo => pkgInfo.root === pkgNameOrRoot);
            if (isSubPackageRoot >= 0) {
                return `${namespace}/${pkgNameOrRoot}`
            }

            return pkgNameOrRoot;
        })

        const newPagePath = `${namespace}/${oldPagePath}`
        newPreloadRule[newPagePath] = oldPreloadInfo;
    }

    return newPreloadRule;
}

module.exports = function (appsConfig, finalAppJson) {
    const mainAppJson = appsConfig[0].appJson
    const preloadRuleOfMain = mainAppJson.preloadRule || {};

    const subAppsConfig = appsConfig.filter(appConfig => appConfig.namespace);
    // gets all preload rules for all sub applications
    const subAppsPreloadRule = subAppsConfig.map(getSubAppPreloadRule);
    const subAppPreloadRules = {};
    // the namespace of each sub application is different, so there is no conflict
    subAppsPreloadRule.forEach(item => Object.assign(subAppPreloadRules, item))

    finalAppJson.preloadRule = {
        ...preloadRuleOfMain,
        ...subAppPreloadRules,
    };
}