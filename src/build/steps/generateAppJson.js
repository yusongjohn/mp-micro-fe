const fsExtra = require("fs-extra");
const path = require('path')

module.exports = function (appsConfig, appJsonHandlers) {
    const mainApp = appsConfig[0]
    const finalAppJson = {...mainApp.appJson};

    // app.json, see https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html

    appJsonHandlers && appJsonHandlers.forEach(handler => handler(appsConfig, finalAppJson))

    // sitemapLocation
    // It's not very important. I won't deal with it for now
    const targetFilePath = path.resolve(mainApp.projectTargetPath, 'app.json')
    fsExtra.outputJsonSync(targetFilePath, finalAppJson, {spaces: 2});
}
