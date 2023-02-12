const genFunctionalPages = require('./genFunctionalPages')
const {genSubPages, genSubPackages} = require('./genPages')
const genRequiredBackgroundModes = require('./genRequiredBackgroundModes')
const genUseExtendedLib = require('./genUseExtendedLib')
const genPlugins = require('./genPlugins')
const genPreloadRule = require('./genPreloadRule')
const genPermission = require('./genPermission')

module.exports = [
    genFunctionalPages,
    genRequiredBackgroundModes,
    genUseExtendedLib,
    genPreloadRule,
    genPermission,
    genSubPages,
    genSubPackages,

    // Ccurrently, the method relies on genSubPackages, so it comes after genSubPackages
    genPlugins
]