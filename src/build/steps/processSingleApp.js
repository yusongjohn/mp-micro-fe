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
    // 1. 防止主应用app.wxss影响子应用，同样删除主应用app.wxss（修改文件名为 app.xxx.wxss 就自动失效了），然后注入到主应用的所有页面中（组件不需要，组件默认受页面影响）
    extendAppWxss(appConfig);
    extendAppWindow(appConfig);
    delete appConfig.appJson.window; // 否则会影响其他子应用

    injectIsolationLogic(appConfig);
}

module.exports = function (appConfig) {
    if (!appConfig.namespace) { // 主应用
        processMainApp(appConfig)
    } else { // 子应用
        processSubApp(appConfig)
    }
}