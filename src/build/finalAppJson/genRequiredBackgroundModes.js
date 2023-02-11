module.exports = function genRequiredBackgroundModes(appsConfig) {
    const bgModes = [];
    appsConfig.forEach(function (appConfig) {
        const appJson = appConfig.appJson;
        const modes = appJson.requiredBackgroundModes || []
        bgModes.push(...modes)
    })
    return Array.from(new Set(bgModes))
}
