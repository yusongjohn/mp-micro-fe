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
    genPlugins // 目前该方法依赖genSubPackages，因此要在其之后
]