!(function(runtime){
const App = runtime.App;
const getApp = runtime.getApp;
const global = runtime.global
const globalThis = runtime.globalThis;
const wx = runtime.getWx();
;// app.js
App({
    onLaunch(options) {
        console.log('B onLaunch', options)
    },
    onShow(options) {
        console.log('B onShow', options)
    },
    globalData: {
        userInfo: null
    }
}) })(require('runtime/index.js'))