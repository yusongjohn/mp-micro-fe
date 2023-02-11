const fsExtra = require('fs-extra')
const {runtimePath, runtimeDirName} = require('../runtimeInfo')
const path = require('path')
const glob = require('glob')

function getAllJsFile(workPath, ignore) {
    return glob.sync('**/*.js', {
        cwd: workPath,
        ignore: [
            ...ignore,
            '**/runtime/*.js'
        ],
    });
}

module.exports = {
    addAppEntry: function (appConfig) {
        const currentWorkPath = appConfig.projectTargetPath;
        const appJsPath = path.resolve(currentWorkPath, 'app.js')
        const targetAppJsName = `app.${appConfig.id}.js`
        const targetAppJsPath = path.resolve(currentWorkPath, targetAppJsName)
        fsExtra.moveSync(appJsPath, targetAppJsPath);

        const files = getAllJsFile(currentWorkPath, [...appConfig.ignore, 'app**.js'])
        files.forEach((file) => {
            const filePath = path.resolve(currentWorkPath, file);
            let content = fsExtra.readFileSync(filePath, 'utf8');
            const appJsRelativePath = path.relative(path.dirname(filePath), targetAppJsPath);
            content = [`require('${appJsRelativePath}');\n`, content,].join('');
            fsExtra.writeFileSync(filePath, content, 'utf8');
        });
    },
    injectIsolationLogic: function (appConfig) {
        const currentWorkPath = appConfig.projectTargetPath;
        const targetRuntimePath = path.resolve(currentWorkPath, runtimeDirName)

        // 1. generate isolation runtime js
        fsExtra.copySync(runtimePath, targetRuntimePath)

        let runtimeSource = fsExtra.readFileSync(`${runtimePath}/index.js`, 'utf8');
        const pagesStr = JSON.stringify(appConfig.allPages);
        const namespace = JSON.stringify(appConfig.namespace);
        const injectConde = `const injectInfo = {pages: ${pagesStr}, namespace: ${namespace} }\n;`
        runtimeSource = `${injectConde}\n ${runtimeSource}`;
        fsExtra.writeFileSync(`${targetRuntimePath}/index.js`, runtimeSource, 'utf8'); // 重写 runtime/index.js

        // 2. inject to all js file
        const files = getAllJsFile(currentWorkPath, appConfig.ignore)

        return Promise.all(files.map(async (file) => {
            const filePath = path.resolve(currentWorkPath, file);
            const runtimeRelativePath = path.relative(path.dirname(filePath), targetRuntimePath);
            let source = fsExtra.readFileSync(filePath, 'utf8');

            const injectGlobalVariable = [
                `const App = runtime.App;`,
                `const getApp = runtime.getApp;`,
                `const global = runtime.global`,
                `const globalThis = runtime.globalThis;`,
                `const wx = runtime.getWx();`
            ]

            source = `!(function(runtime){\n${injectGlobalVariable.join('\n')}\n;${source} })(require('${runtimeRelativePath}/index.js'))`
            fsExtra.writeFileSync(filePath, source, 'utf8');
        }))
    }
}