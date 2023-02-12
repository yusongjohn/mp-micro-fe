const path = require('path')

// 验证所有子应用都提供了namespace
// 有一个主应用
function validateConfig(userConfig) {
    const allApps = userConfig.apps;
    const nsSet = new Set();
    const subApps = allApps.filter(appConfig => {
        const ns = appConfig.namespace
        ns && nsSet.add(ns)
        return ns
    })

    if (nsSet.size !== subApps.length) {
        return console.log('repeated namespace')
    }

    if (subApps.length + 1 !== allApps.length) {
        return console.error('there are multi main app')
    }

    const mainAppIndex = allApps.findIndex(appConfig => !appConfig.namespace);
    const mainAppConfig = allApps.splice(mainAppIndex, 1);
    allApps.unshift(mainAppConfig[0]); // 确保第一个是主应用，后面逻辑是这么假设的
}

const ignore = ['**/node_modules', '**/.git', '**/*.map'];
module.exports = function (configFilePath, configsHandlers) {
    const userConfig = require(configFilePath)
    let workspace = userConfig.workspace;
    userConfig.distDir = path.resolve(userConfig.workspace, 'dist'); // 最终产物的目录
    workspace = userConfig.workspace = path.resolve(workspace, '.temp'); // 工作根目录

    const handler = appConfig => {
        appConfig.ignore = [...(appConfig.ignore || []), ...ignore];
        appConfig.id = appConfig.namespace ? appConfig.namespace : 'main';
        appConfig.projectTargetPath = path.join(workspace, appConfig.id)
    }
    userConfig.apps.map(handler);

    validateConfig(userConfig)

    configsHandlers && configsHandlers.forEach(handler => handler(userConfig))

    return userConfig
}