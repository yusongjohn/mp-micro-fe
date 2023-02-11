const fsExtra = require('fs-extra')
const path = require('path')
const utils = require('../utils')


module.exports = function (buildOptions) {
    const workspace = buildOptions.workspace;
    fsExtra.emptyDirSync(workspace);
    fsExtra.emptyDirSync(buildOptions.distDir);

    const apps = buildOptions.apps;
    apps.forEach((app) => {
        const {projectDir, id, ignore} = app;
        const targetPath = path.resolve(workspace, id)
        fsExtra.copySync(projectDir, targetPath, {filter: utils.createCopyFilter(ignore)});
    });
}

