const compile = require("../src/index");

const configFilePath = process.cwd() + '/compose.config.js'
compile(configFilePath)