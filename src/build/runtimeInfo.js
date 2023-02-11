const path = require('path');

const runtimeDirName = 'runtime'
module.exports = {
    runtimeDirName,
    runtimePath: path.resolve(__dirname,`../${runtimeDirName}`)
}