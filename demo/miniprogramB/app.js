runtime.logicGlobal.b = 'b'
// app.js
App({
    onLaunch(options) {
        console.log('B onLaunch', options)
        console.log('B globalThis', globalThis)
    },
    onShow(options) {
        console.log('B onShow', options)
        const app = getApp();
        console.log('B onShow', app.globalData)
    },
    globalData: {
        b: 'b'
    }
})