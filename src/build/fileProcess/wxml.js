const path = require('path')
const glob = require("glob");
const fsExtra = require("fs-extra");
const utils = require('../utils')

module.exports = {
    modifyWxmlReferencePath(appConfig) {
        const currentWorkPath = appConfig.projectTargetPath;
        const files = glob.sync('**/*.wxml', {
            cwd: currentWorkPath,
            ignore: [],
        });
        const allPages = appConfig.allPages;

        const handler = function (file) {
            const parentFilePath = path.resolve(currentWorkPath, file);
            const content = fsExtra.readFileSync(parentFilePath, 'utf8');

            const createGetPath = (currentWorkPath, parentFilePath) => (referencePath) => {
                const relativePath = utils.getRelativePath(currentWorkPath, parentFilePath, referencePath).referencePath
                return `/${appConfig.namespace}/${relativePath}`
            }
            const _getPath = createGetPath(currentWorkPath, parentFilePath)


            const replaceContent = content
                .replace(/(<import [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${_getPath($2)}"${$3}`)
                .replace(/(<import [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${_getPath($2)}'${$3}`)
                .replace(/(<include [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${_getPath($2)}"${$3}`)
                .replace(/(<include [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${_getPath($2)}'${$3}`)
                .replace(/(<image [^>]*)src="([^"]+)"([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src="${_getPath($2)}"${$3}`)
                .replace(/(<image [^>]*)src='([^']+)'([^>]*>)/gi, ($0, $1, $2, $3) => `${$1}src='${_getPath($2)}'${$3}`)
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

            fsExtra.writeFileSync(parentFilePath, replaceContent, 'utf8');
        }
        files.forEach(handler)
    }
}