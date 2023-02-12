module.exports = function (appsConfig, finalAppJson) {
    const extendedLib = {};
    appsConfig.forEach(function (appConfig) {
        const useExtendedLib = appConfig.appJson.useExtendedLib || {}
        for (let key in useExtendedLib) {
            if (useExtendedLib[key]) {
                extendedLib[key] = true;
            }
        }
    })
    finalAppJson.useExtendedLib = extendedLib;
}