const utils = require('../utils')
const fsExtra = require('fs-extra')

function copyMainApp(distDir, appConfig) {
    const filter = utils.createCopyFilter(appConfig.ignore);
    fsExtra.copySync(appConfig.projectTargetPath, distDir, {
        filter,
        errorOnExist: true,
    });
}

function copySubApp(distDir, appConfig) {
    const subAppJson = appConfig.appJson
    const filterRules = [
        ...appConfig.ignore,
        // ignore these files in sub app, because the main app decides the final content of these files
        /project.config.json$/,
        /project.private.config.json$/,
        /app.json$/
    ]

    if (subAppJson.sitemapLocation) {
        filterRules.push(new RegExp(`${subAppJson.sitemapLocation}$`),)
    }

    if (subAppJson.themeLocation) {
        filterRules.push(new RegExp(`${subAppJson.themeLocation}$`))
    }

    const filter = utils.createCopyFilter(filterRules)

    const subAppTargetDir = `${distDir}/${appConfig.namespace}`
    fsExtra.ensureDirSync(subAppTargetDir);
    fsExtra.copySync(appConfig.projectTargetPath, subAppTargetDir, {
        filter,
        errorOnExist: true,
    });
}

module.exports = function (buildConfig, distHandlers) {
    const appsConfig = buildConfig.apps;
    fsExtra.emptydirSync(buildConfig.distDir)

    distHandlers && distHandlers.forEach(handler => distHandlers(buildConfig));

    copyMainApp(buildConfig.distDir, appsConfig[0]);
    for (let i = 1; i < appsConfig.length; i++) {
        copySubApp(buildConfig.distDir, appsConfig[i])
    }
}