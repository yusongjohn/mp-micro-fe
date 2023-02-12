const subPkgKey = 'subPackages';

module.exports = {
    subPkgKey,
    genSubPages: function (appsConfig, finalAppJson) {
        const subApps = appsConfig.filter(appConfig => appConfig.namespace);

        // the pages of sub app should migrate to mainAppJson.pages
        // it couldn't split as sub pkg in current sub app.
        const subAppPages = []
        subApps.map((appConfig) => {
            const subAppJson = appConfig.appJson
            const currentSubAppPages = subAppJson.pages.map(page => `${appConfig.namespace}/${page}`)
            subAppPages.push(...currentSubAppPages)
        });
        finalAppJson.pages.push(...subAppPages)
    },
    genSubPackages: function (appsConfig, finalAppJson) {
        const subApps = appsConfig.filter(appConfig => appConfig.namespace);

        const mainAppJson = appsConfig[0].appJson;
        // ths sub packages of the main app.
        const subPkgsOfMain = mainAppJson[subPkgKey] || [];
        // the sub packages of all the sub apps.
        const subAppSubPkgs = []
        subApps.forEach((appConfig) => {
            const subAppJson = appConfig.appJson
            const _tmp = subAppJson[subPkgKey] || [];
            _tmp.forEach(subPkg => {
                subPkg.root = `${appConfig.namespace}/${subPkg.root}`;
                return subPkg
            });
            subAppSubPkgs.push(..._tmp)
        });
        // collect all sub packages, then update the subPackages's value in mainAppJson
        finalAppJson[subPkgKey] = subPkgsOfMain.concat(subAppSubPkgs)
    }
}
