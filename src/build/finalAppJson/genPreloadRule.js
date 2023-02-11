const {subPkgKey} = require("./genPages");

function getSubAppPreloadRule(subAppConfig) {
    const namespace = subAppConfig.namespace;
    const oldPreloadRule = subAppConfig.appJson.preloadRule;

    const newPreloadRule = {}
    const subPackages = subAppConfig.appJson[subPkgKey];

    // https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html
    // preloadRule 格式
    for (let oldPagePath in oldPreloadRule) {
        const oldPreloadInfo = oldPreloadRule[oldPagePath];
        // 直接修改oldVal上的packages中的包名
        const preloadPackages = oldPreloadInfo.packages || [];
        oldPreloadInfo.packages = preloadPackages.map(pkgNameOrRoot => {
            const isSubPackageRoot = subPackages.findIndex(pkgInfo => pkgInfo.root === pkgNameOrRoot);
            if (isSubPackageRoot >= 0) {
                return `${namespace}/${pkgNameOrRoot}`
            }

            // 注意 __APP__ 情况，由于子应用的pages也迁移到最终的主包中，因此这里不修改。

            return pkgNameOrRoot;
        })

        const newPagePath = `${namespace}/${oldPagePath}`
        newPreloadRule[newPagePath] = oldPreloadInfo;
    }

    return newPreloadRule;
}

module.exports = function (appsConfig) {
    const mainAppJson = appsConfig[0].appJson
    const preloadRuleOfMain = mainAppJson.preloadRule || {};

    const subAppsConfig = appsConfig.filter(appConfig => appConfig.namespace);
    // 获取所有子应用的preloadRule
    const subAppsPreloadRule = subAppsConfig.map(getSubAppPreloadRule);
    const subAppPreloadRules = {};
    // 合并为一个对象，由于每个子应用的namespace不一样，因此不会冲突
    subAppsPreloadRule.forEach(item => Object.assign(subAppPreloadRules, item))

    return {
        ...preloadRuleOfMain,
        ...subAppPreloadRules,
    };
}