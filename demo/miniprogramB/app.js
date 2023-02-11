// app.js
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
})