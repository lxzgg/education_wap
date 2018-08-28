const util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    isLogin: true,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    encryptedData: '',
    iv: '',
    loginCode: '',
    isEmpty: true
  },

  getBannerPic() {
    util.wxpromisify({
      url: 'index/adList',
      data: wx.getStorageSync('userInfo'),
      method: 'post'
    }).then((res) => {
      if (res.response === 'data') {
        let arr = res.list.map((val, key, arr) => {
          return val.ad_image
        })
        this.setData({imgUrls: []})
        this.setData({imgUrls: arr})
      }
    })
  },
  getArticleList() {
    let params = {
      class_id: '',
      num: '',
      page: '',
      user_id: wx.getStorageSync('userInfo').user_id,
      token: wx.getStorageSync('userInfo').token
    }
    util.wxpromisify({
      url: 'index/article',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res.response === 'data') {
        console.log(res)
        // let arr = res.list.map((val,key,arr)=>{
        //   return val.ad_image
        // })
        // this.setData({imgUrls:[]})
        // this.setData({imgUrls:arr})
      } else {

      }
    })
  }
})
