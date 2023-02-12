const {extendAppWxss, extendAppWindow} = require("../fileProcess/wxss");
const {injectIsolationLogic, addAppEntry} = require("../fileProcess/js");
const {modifyWxmlReferencePath} = require("../fileProcess/wxml");
const {modifyComponentReferencePath} = require("../fileProcess/json");

async function processSubApp(appConfig) {
    // 1. style isolation：wxss and json.window
    extendAppWxss(appConfig);
    extendAppWindow(appConfig)

    // 2. js isolation
    // Inject isolation logic into all js files (sandbox)
    injectIsolationLogic(appConfig);
    addAppEntry(appConfig);

    // 3. modify the path referenced by wxml
    modifyWxmlReferencePath(appConfig);

    // 4.  modify the path referenced by json.usingComponent
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