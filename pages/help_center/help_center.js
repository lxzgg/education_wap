// pages/help_center/help_center.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    center_content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.wxpromisify({
      url: 'help/help_list',
      data: {},
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({center_content: res.list})
      } else {
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      wx.showModal({
        title: '提示',
        content: '请求超时',
        showCancel: false
      })
    })
  }
})
