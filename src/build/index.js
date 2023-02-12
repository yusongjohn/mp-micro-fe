const fsExtra = require("fs-extra");
const path = require('path')
const utils = require("./utils");
const getBuildConfig = require('./steps/buildOptions');
const initiateWorkspace = require('./steps/initiateWorkspace')
const processSingleApp = require('./steps/processSingleApp')
const genFinalAppJsonFile = require('./steps/generateAppJson')
const genDist = require('./steps/genDist')
const defaultAppJsonHandlers = require('./defaultAppJsonHandlers')

const handler = function (appConfig) {
    const appJsonPath = path.resolve(appConfig.projectTargetPath, 'app.json');
    const appJson = fsExtra.readJsonSync(appJsonPath);
    const allPages = utils.getAllPages(appJson);

    appConfig.appJson = appJson;
    appConfig.allPages = allPages;
}

const stepsCount = 6;
module.exports = function compile(configFilePath, intercepts) {
    // 需要校验 intercepts 参数是否合法，暂不处理
    if (!intercepts) intercepts = {};

    // 1. get the compile config
    const buildConfig = getBuildConfig(configFilePath, (intercepts.config || []));
    console.log(`step 1/${stepsCount} done`)

    // 2. prepare the workspace
    initiateWorkspace(buildConfig, (intercepts.workspace || []));
    console.log(`step 2/${stepsCount} done`)

    // mount app's allPages and appJson attributes to appConfig
    const appsConfig = buildConfig.apps;
    appsConfig.forEach(handler)

    // 3. process every single app
    appsConfig.map(appConfig => processSingleApp(appConfig, (intercepts.singleApp || [])),)
    console.log(`step 3/${stepsCount} done`)

    // 4.begin to merge all app to one
    const appJsonHandlers = (intercepts.appJson || [])
    genFinalAppJsonFile(appsConfig, [...appJsonHandlers, ...defaultAppJsonHandlers]);
    console.log(`step 4/${stepsCount} done`)

    // 5. generate dist
    genDist(buildConfig, (intercepts.dist || []))
    console.log(`step 5/${stepsCount} done`)

    // 6. remove workspace
    fsExtra.removeSync(buildConfig.workspace)
    console.log(`step 6/${stepsCount} done`)

    console.log(`=== success ===`)
}
