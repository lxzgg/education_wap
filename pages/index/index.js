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
    encryptedData:'',
    iv:'',
    loginCode:'',
    isEmpty: true
  },
  onLoad: function () {
    let that = this
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                encryptedData:res.encryptedData,
                iv: res.iv
              })
              wx.login({
                  success: function(ret){
                     that.setData({loginCode: ret.code})
                      util.wxpromisify({
                        url: 'user/login',
                        data: {
                           code:ret.code,
                           encryptedData:res.encryptedData,
                           iv: res.iv
                        },
                        method: 'post'
                      }).then((data)=>{
                        if(data.response != 'error'){
                         wx.setStorageSync("userInfo", {user_id: data.data.user_id,token:data.data.token})
                         that.getBannerPic()
                         that.getArticleList()
                          
                        }
                      }).catch((err)=>{
                      })
                  }
              })
            }
          })
        }
      }
    })
  },
  getBannerPic(){
    util.wxpromisify({
      url: 'index/adList',
      data: wx.getStorageSync('userInfo'),
      method: 'post'
    }).then((res)=>{
      if(res.response === 'data'){
        let arr = res.list.map((val,key,arr)=>{
          return val.ad_image
        })
        this.setData({imgUrls:[]})
        this.setData({imgUrls:arr})
      }
    })
  },
  getArticleList(){
    let params = {
      class_id:'',
      num:'',
      page:'',
      user_id: wx.getStorageSync('userInfo').user_id,
      token:wx.getStorageSync('userInfo').token
    }
    util.wxpromisify({
      url: 'index/article',
      data: params,
      method: 'post'
    }).then((res)=>{
      if(res.response === 'data'){
        console.log(res)
        // let arr = res.list.map((val,key,arr)=>{
        //   return val.ad_image
        // })
        // this.setData({imgUrls:[]})
        // this.setData({imgUrls:arr})
      }else{

      }
    })
  }
})
