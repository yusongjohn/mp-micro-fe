const path = require('path');
const fsExtra = require('fs-extra')

module.exports = {
    extendAppWindow: function (appConfig) {
        const projectTargetPath = appConfig.projectTargetPath;
        const subAppAllPages = appConfig.allPages;
        const subAppGlobalWindow = appConfig.appJson.window;
        if (!subAppGlobalWindow || !Object.keys(subAppGlobalWindow).length) {
            return
        }

        subAppAllPages.forEach(function (page) {
            const pageJsonPath = path.resolve(projectTargetPath, `${page}.json`);
            let pageJson = fsExtra.readJsonSync(pageJsonPath);
            // https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
            // the attribute of window in page.json has higher priority than app.json
            pageJson = Object.assign({}, subAppGlobalWindow, pageJson);
            fsExtra.outputJsonSync(pageJsonPath, pageJson, {spaces: 2})
        })
    },
    extendAppWxss: function (appConfig) {
        const projectTargetPath = appConfig.projectTargetPath
        const appWxssPath = path.resolve(projectTargetPath, 'app.wxss');
        if (!fsExtra.pathExistsSync(appWxssPath)) return;

        // 复制一份 应用 app.wxss
        const targetAppWxssPath = path.resolve(projectTargetPath, `app.${appConfig.id}.wxss`);
        fsExtra.moveSync(appWxssPath, targetAppWxssPath);

        function handler(page) {
            const pageWxssPath = path.resolve(projectTargetPath, `${page}.wxss`);
            fsExtra.ensureFileSync(pageWxssPath);

            let pageWxss = fsExtra.readFileSync(pageWxssPath, 'utf8');
            const relativePath = path.relative(path.dirname(pageWxssPath), targetAppWxssPath)

            // 相对路径引入
            pageWxss = [`@import "${relativePath}";`, pageWxss,].join('\n');
            // 重写原先的page.wxss
            fsExtra.writeFileSync(pageWxssPath, pageWxss, 'utf8');
        }

        (appConfig.allPages || []).forEach(handler)
    }
}