const fsExtra = require("fs-extra");
const path = require('path')

const {subPkgKey, genSubPages, genSubPackages} = require('./genPages')
const genRequiredBackgroundModes = require('./genRequiredBackgroundModes')
const genUseExtendedLib = require('./genUseExtendedLib')
const genPlugins = require('./genPlugins')
const genPreloadRule = require('./genPreloadRule')
const genPermission = require('./genPermission')

module.exports = function (appsConfig) {
    const mainApp = appsConfig[0]
    const finalAppJson = {...mainApp.appJson};

    // app.json配置项
    // https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html

    // functionalPages: boolean
    finalAppJson.functionalPages = appsConfig.some(({appJson}) => appJson.functionalPages);

    // requiredBackgroundModes: string[]
    finalAppJson.requiredBackgroundModes = genRequiredBackgroundModes(appsConfig)

    // useExtendedLib: Object
    finalAppJson.useExtendedLib = genUseExtendedLib(appsConfig);

    finalAppJson.preloadRule = genPreloadRule(appsConfig);

    finalAppJson.permission = genPermission(appsConfig);

    // 主应用的pages就是最终的pages
    finalAppJson.pages.push(...genSubPages(appsConfig));

    // 找到所有应用的 subpackages
    finalAppJson[subPkgKey] = genSubPackages(appsConfig);

    finalAppJson.plugins = genPlugins(appsConfig, finalAppJson); // 注意 依赖 genSubPackages

    // sitemapLocation 不是很重要，暂不处理
    const targetFilePath = path.resolve(mainApp.projectTargetPath, 'app.json')
    fsExtra.outputJsonSync(targetFilePath, finalAppJson, {spaces: 2});
}
