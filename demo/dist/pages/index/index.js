const app = getApp()


Page({
    data: {
        type: 'A'
    },
    onLoad() {
        wx.navigateTo({
            url: '/b/pages/index/index',
        })

        // wx.downloadFile({
        //   url: 'https://wework.qpic.cn/wwpic/392247_Lp20IUkjT0KuCzW_1648665754/0',
        //   success(res){
        //     if (res.statusCode === 200) {
        //         console.log(res) 
        //         const fileSystemManager =  wx.getFileSystemManager()
        //         fileSystemManager.readFile(
        //             {
        //                 filePath: res.tempFilePath,
        //                 encoding:'utf-8',
        //                 success(res){
        //                     console.log(res)
        //                 }
        //             }
        //         ) 

        //         // wx.previewImage({
        //         //   urls: [res.tempFilePath],
        //         // })
        //       }
        //   }
        // })
    }
})