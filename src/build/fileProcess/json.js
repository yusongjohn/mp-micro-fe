const path = require('path')
const fsExtra = require("fs-extra");
const utils = require('../utils')

function travelUsingComponents(mpJson, projectTargetPath, parentFilePath, afterHandler) {
    if (!mpJson.usingComponents) {
        mpJson.usingComponents = {}
    }
    const usingComponents = mpJson.usingComponents
    if (Object.keys(usingComponents).length === 0) {
        return;
    }

    for (let componentTag in usingComponents) {
        const {
            referencePath,
            localPath
        } = utils.getRelativePath(projectTargetPath, parentFilePath, usingComponents[componentTag]);

        usingComponents[componentTag] = referencePath;

        // 组件引用的组件
        const componentJson = fsExtra.readJsonSync(`${localPath}.json`);
        travelUsingComponents(componentJson, projectTargetPath, parentFilePath, afterHandler)
    }
    afterHandler && afterHandler(mpJson, parentFilePath)
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
            travelUsingComponents(pageJson, projectTargetPath, pageJsonPath, function (mpJson, jsonFilePath) {
                const usingComponents = Object.assign(mpJson.usingComponents, globalComponents);
                for (key in usingComponents) {
                    const orignRelativePath = usingComponents[key];
                    usingComponents[key] = `/${appConfig.namespace}/${orignRelativePath}` // 转为绝对路径（小程序根目录）
                }
                mpJson.usingComponents = usingComponents;
                fsExtra.outputJsonSync(jsonFilePath, mpJson, {spaces: 2});
            })
        });
    }
}
