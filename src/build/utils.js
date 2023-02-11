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
    getRelativePath: function (currentWorkPath, parentLocalPath, referencePath) {
        let localPath = '';
        if (referencePath) {
            try {
                if (path.isAbsolute(referencePath)) {
                    localPath = path.resolve(currentWorkPath, `${currentWorkPath}/${referencePath}`)
                } else {
                    localPath = path.resolve(path.dirname(parentLocalPath), referencePath)
                }
                // 全部转为相对路径的相对
                referencePath = path.relative(currentWorkPath, localPath);
            } catch (e) {
            }
        }
        return {referencePath, localPath};
    }
}