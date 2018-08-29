// pages/my/my.js
let util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    nickname: '',
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.wxpromisify({
      url: 'user/userInfo',
      data: wx.getStorageSync('userInfo'),
      method: 'post'
    }).then((ret) => {
      if (ret.response == 'data') {
        this.setData({
          nickname: ret.data.nickname,
          imageUrl: ret.data.avatarUrl
        })
      }
    }).catch((err) => {})
  },

  goToPersonInfo() {
    wx.navigateTo({
      url: '/pages/personData/personData',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

})
