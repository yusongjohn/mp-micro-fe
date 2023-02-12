const {extendAppWxss, extendAppWindow} = require("../fileProcess/wxss");
const {injectIsolationLogic, addAppEntry} = require("../fileProcess/js");
const {modifyWxmlReferencePath} = require("../fileProcess/wxml");
const {modifyComponentReferencePath} = require("../fileProcess/json");

async function processSubApp(appConfig) {
    // 1. 样式相关：wxss and json.window
    extendAppWxss(appConfig); // 子应用的app.wxss样式不生效，所有的wxss文件需要@import子应用的app.wxss，
    // 子应用的 window 处理？
    extendAppWindow(appConfig)

    // 2. js 相关
    // 给所有的js文件注入隔离逻辑（sandbox）
    injectIsolationLogic(appConfig);
    addAppEntry(appConfig);

    // 3. wxml 文件修改
    modifyWxmlReferencePath(appConfig);

    // 4. json modifyComponentReferencePath
    modifyComponentReferencePath(appConfig)
}


function processMainApp(appConfig) {
    // 1. To prevent the main app.wxss from affecting child applications, delete the main app.wxss as well
    // app.xxx.wxss is automatically invalidated and injected into all pages of the main application
    // (not required by components, components are affected by pages by default)
    extendAppWxss(appConfig);
    extendAppWindow(appConfig);

    // Otherwise, other sub-applications will be affected
    delete appConfig.appJson.window;

    injectIsolationLogic(appConfig);
}

module.exports = function (appConfig, singleAppHandlers) {
    singleAppHandlers = singleAppHandlers || []
    if (!appConfig.namespace) { // main app
        processMainApp(appConfig)
    } else { // sub app
        processSubApp(appConfig)
    }

    singleAppHandlers && singleAppHandlers.forEach(handler => handler(appConfig))
}