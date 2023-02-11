// app.js
App({
    onLaunch(options) {
        console.log('A onLaunch', options)
    },
    onShow(options) {
        console.log('A onShow', options)
    },
    globalData: {
        userInfo: null
    }
})