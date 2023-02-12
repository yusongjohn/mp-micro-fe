const {getSubPkgsFromJson} = require('./utils')

module.exports = function (appsConfig, finalAppJson) {
    const mainAppJsPlugins = appsConfig[0].appJson.plugins || {};
    const subApps = appsConfig.filter(appConfig => appConfig.namespace);
    let globalPlugins = {};

    // 1. get the global plugins in each sub application first
    subApps.forEach(function (subAppConfig) {
        const _plugins = subAppConfig.appJson.plugins || {}
        globalPlugins = Object.assign(globalPlugins, _plugins)
    })

    // 2.Then look for the re-referenced plugins in the modified global subPackages based genSubPackages step
    // The same plug-in cannot be referenced by more than one subpackage
    // see https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html

    // Note: This assumes the same alias name as the plugin name, and the mp developer tools will verify both
    const sharedPlugins = {};
    const finalSubPkgs = getSubPkgsFromJson(finalAppJson);

    const map = {}
    finalSubPkgs.forEach(function (subPkg) {
        const plugins = subPkg.plugins || {};
        for (let key in plugins) {
            // depending on the key configured for the plugin,
            // the developer should ensure that the key configured for the same plugin in all app is the same
            if (!map[key]) {
                map[key] = {
                    value: plugins[key],
                    reference: []
                };
            }
            map[key].reference.push(subPkg.plugins)
        }
    })

    for (let key in map) {
        const pluginInfo = map[key];
        if (pluginInfo.reference.length >= 2) {
            // collect plugins that are referenced more than once
            sharedPlugins[key] = pluginInfo.value;
            // remove from the subpackage
            pluginInfo.reference.forEach(itemPlugins => delete itemPlugins[key]);
        }
    }

    globalPlugins = Object.assign(globalPlugins, mainAppJsPlugins, sharedPlugins) // 主应用的插件优先级高
    finalAppJson.plugins = globalPlugins;
}
