runtime.logicGlobal.c = 'c'

// app.js
App({
    onLaunch(options) {
        console.log('C onLaunch', options)
        console.log('B globalThis', globalThis)
    },
    onShow(options) {
        console.log('C onShow', options)
        const app = getApp();
        console.log('C onShow', app.globalData)

        console.log('C onShow runtime.logicGlobal', runtime.logicGlobal)
    },
    globalData: {
        c: 'c'
    }
})