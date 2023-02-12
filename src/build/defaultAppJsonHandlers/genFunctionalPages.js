module.exports = function (appsConfig, finalAppJson) {
    finalAppJson.functionalPages = appsConfig.some(({appJson}) => appJson.functionalPages);
}