require('../../app.b.js');
!(function(runtime){
const App = runtime.App;
const getApp = runtime.getApp;
const global = runtime.global
const globalThis = runtime.globalThis;
const wx = runtime.getWx();
;const app = getApp()


Page({
    data: {
        type: 'B'
    },
    onLoad() {
        setTimeout(() => {
            wx.navigateTo({
                url: '/pages/secondPage/index',
            })
        }, 1 * 1000)
    }
}) })(require('../../runtime/index.js'))