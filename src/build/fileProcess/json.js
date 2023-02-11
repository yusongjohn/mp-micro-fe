const path = require('path')
const fsExtra = require("fs-extra");

function travelUsingComponents(mpJson, projectTargetPath, parentFilePath, afterHandler) {
    if (!mpJson.usingComponents) {
        mpJson.usingComponents = {}
    }
    const usingComponents = mpJson.usingComponents
    if (Object.keys(usingComponents).length === 0) {
        return;
    }

    for (let componentTag in usingComponents) {
        let referencePath = usingComponents[componentTag]
        let fileLocalPath = '';
        if (path.isAbsolute(referencePath)) {
            fileLocalPath = path.resolve(projectTargetPath, `${projectTargetPath}/${referencePath}`)
        } else {
            fileLocalPath = path.resolve(path.dirname(parentFilePath), referencePath)
        }
        referencePath = path.relative(projectTargetPath, fileLocalPath); // 全部转为相对路径，则不需要考虑namespace问题
        usingComponents[componentTag] = referencePath;

        // 组件引用的组件
        const componentJson = fsExtra.readJsonSync(`${fileLocalPath}.json`);
        travelUsingComponents(componentJson, projectTargetPath, parentFilePath, afterHandler)
    }
    afterHandler && afterHandler(mpJson)
}


module.exports = {
    modifyComponentReferencePath: function (appConfig) {
        const projectTargetPath = appConfig.projectTargetPath;
        const appJsonPath = path.resolve(appConfig.projectTargetPath, 'app.json');

        // 1. 先是将所有的usingComponents中的路径都修改，
        // 全局组件，页面引用，组件引用
        travelUsingComponents(appConfig.appJson, projectTargetPath, appJsonPath)
        const globalComponents = appConfig.appJson.usingComponents;

        // 页面
        const allPages = appConfig.allPages || [];
        allPages.forEach(function (page) {
            const pageJsonPath = path.resolve(projectTargetPath, `${page}.json`);
            const pageJson = fsExtra.readJsonSync(pageJsonPath);
            travelUsingComponents(pageJson, projectTargetPath, pageJsonPath, function (json) {
                json.usingComponents = Object.assign(json.usingComponents, globalComponents);
            })
        });
    }
}
