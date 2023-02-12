
runtime.logicGlobal.a = 'a'
// app.js
App({
    onLaunch(options) {
        console.log('A onLaunch', options)
        globalThis.mainShareData = 'mainShareData'
    },
    onShow(options) {
        console.log('A onShow', options)
    },
    globalData: {
        a: 'a'
    }
})