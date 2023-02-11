require('../../app.b.js');
!(function(runtime){
const App = runtime.App;
const getApp = runtime.getApp;
const global = runtime.global
const globalThis = runtime.globalThis;
const wx = runtime.getWx();
;// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
 })(require('../../runtime/index.js'))