const fsExtra = require("fs-extra");
const path = require('path')

module.exports = function (appsConfig, appJsonHandlers) {
    const mainApp = appsConfig[0]
    const finalAppJson = {...mainApp.appJson};

    // app.json配置项
    // https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html

    appJsonHandlers && appJsonHandlers.forEach(handler => handler(appsConfig, finalAppJson))

    // sitemapLocation 不是很重要，暂不处理
    const targetFilePath = path.resolve(mainApp.projectTargetPath, 'app.json')
    fsExtra.outputJsonSync(targetFilePath, finalAppJson, {spaces: 2});
}
