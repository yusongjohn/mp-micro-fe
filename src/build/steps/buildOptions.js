const path = require('path')

// Verify that all sub applications provide namespaces
// There is only one main application
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
    // Make sure the first one is the main application, as the later logic assumes
    allApps.unshift(mainAppConfig[0]);
}

const ignore = ['**/node_modules', '**/.git', '**/*.map'];
module.exports = function (configFilePath, configsHandlers) {
    const userConfig = require(configFilePath)
    let workspace = userConfig.workspace;
    // the final dist
    userConfig.distDir = path.resolve(userConfig.workspace, 'dist');
    // workspace
    workspace = userConfig.workspace = path.resolve(workspace, '.temp');

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