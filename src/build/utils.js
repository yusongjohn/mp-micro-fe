const path = require('path')
const anymatch = require('anymatch')

function createCopyFilter(ignore = []) {
    return function (src) {
        return !anymatch(ignore, src);
    };
}

module.exports = {
    createCopyFilter,
    getAllPages: function (appJson) {
        const pages = appJson.pages || [];
        const subPackages = appJson.subpackages || appJson.subPackages || [];
        const allPages = [...pages]

        function handler(subPackage) {
            const {root} = subPackage;
            const pages = subPackage.pages || [];
            allPages.push(...pages.map(page => `${root}/${page}`))
        }

        subPackages.forEach(handler)
        return allPages;
    },
    relativeFilePath: function (fromFile, toFile, rootDir) {
        return path.isAbsolute(toFile) ? path.relative(path.dirname(fromFile), path.resolve(rootDir, `.${toFile}`)) : toFile;
    }
}