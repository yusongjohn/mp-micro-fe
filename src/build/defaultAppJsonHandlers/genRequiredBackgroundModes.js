module.exports = function genRequiredBackgroundModes(appsConfig, finalAppJson) {
    const bgModes = [];
    appsConfig.forEach(function (appConfig) {
        const appJson = appConfig.appJson;
        const modes = appJson.requiredBackgroundModes || []
        bgModes.push(...modes)
    })
    finalAppJson.requiredBackgroundModes = Array.from(new Set(bgModes))
}
