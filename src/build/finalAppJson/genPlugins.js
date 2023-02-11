const {subPkgKey} = require('./genPages')

module.exports = function (appsConfig, mergedAppJson) {
    const mainAppJsPlugins = appsConfig[0].appJson.plugins || {};
    const subApps = appsConfig.filter(appConfig => appConfig.namespace);
    let globalPlugins = {};

    // 1. 先获取各子应用中的全局插件
    subApps.forEach(function (subAppConfig) {
        const _plugins = subAppConfig.appJson.plugins || {}
        globalPlugins = Object.assign(globalPlugins, _plugins)
    })

    // 2. 然后基于 genSubPackages 修改后的全局 subPackages 中查找被重复引用的插件
    // 同一个插件不能被多个分包引用，见 https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html
    // 注意：这里假定别名和插件名称一致，小程序开发者工具都会对二者都进行校验
    const sharedPlugins = {};
    const finalSubPkgs = mergedAppJson[subPkgKey];

    const map = {}
    finalSubPkgs.forEach(function (subPkg) {
        const plugins = subPkg.plugins || {};
        for (let key in plugins) {
            // 根据开发者配置插件的key来区分，开发者应该保证，同一插件配置的key是一样的
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
            // 收集被多次引用的插件
            sharedPlugins[key] = pluginInfo.value;
            // 从分包中删除
            pluginInfo.reference.forEach(itemPlugins => delete itemPlugins[key]);
        }
    }

    globalPlugins = Object.assign(globalPlugins, mainAppJsPlugins, sharedPlugins) // 主应用的插件优先级高
    return globalPlugins;
}
