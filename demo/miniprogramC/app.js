// app.js
App({
    onLaunch(options) {
        console.log('C onLaunch', options)
    },
    onShow(options) {
        console.log('C onShow', options)
    },
    globalData: {
        userInfo: null
    }
})