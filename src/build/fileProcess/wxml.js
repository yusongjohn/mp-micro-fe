const path = require('path')
const glob = require("glob");
const fsExtra = require("fs-extra");
const utils = require('../utils')

function getPath({currentWorkPath, filePath, comp}) {
    let rightPath = comp;
    if (comp) {
        try {
            const compPath = utils.relativeFilePath(filePath, comp, currentWorkPath);
            rightPath = compPath;
        } catch (e) {
        }
    }
    return rightPath;
}

function getPagePath({pages, router, originPath}) {
    let rightPath = originPath;
    if (originPath) {
        try {
            const isPage = pages.filter(page => originPath.includes(page)).length;
            if (isPage) {
                rightPath = `/${router}/${originPath.replace(/^\//, '')}`;
            }
        } catch (e) {
        }
    }
    return rightPath;
}

module.exports = {
    modifyWxmlReferencePath(appConfig) {
        const currentWorkPath = appConfig.projectTargetPath;
        const files = glob.sync('**/*.wxml', {
            cwd: currentWorkPath,
            ignore: [],
        });
        const allPages = appConfig.allPages;
        const router = appConfig.namespace;

        const handler = function (file) {
            const filePath = path.resolve(currentWorkPath, file);
            const content = fsExtra.readFileSync(filePath, 'utf8');

            const replaceContent = content
                .replace(/(<import [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}"${$3}`)
                .replace(/(<import [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}'${$3}`)
                .replace(/(<include [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}"${$3}`)
                .replace(/(<include [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}'${$3}`)
                .replace(/(<image [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}"${$3}`)
                .replace(/(<image [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${getPath({
                    currentWorkPath,
                    filePath,
                    comp: $2
                })}'${$3}`)
                .replace(/(<navigator [^>]*)url="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}url="${getPagePath({
                    pages: allPages,
                    router,
                    originPath: $2
                })}"${$3}`)
                .replace(/(<navigator [^>]*)url='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}url='${getPagePath({
                    pages: allPages,
                    router,
                    originPath: $2
                })}'${$3}`);

            fsExtra.writeFileSync(filePath, replaceContent, 'utf8');
        }
        files.forEach(handler)
    }
}