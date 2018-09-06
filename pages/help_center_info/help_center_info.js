// pages/help_center_info/help_center_info.js
const app = getApp()
const utils = require('../../utils/util')
Page({
  data: {
center_detail:[]
  },
  onLoad: function (options) {
    let id = options.id
    utils.wxpromisify({
      url: 'help/help_detail',
      data: {
        id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({center_detail: res.data.images})
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
  },
  previewImage(){
    let img_arr = this.data.center_detail
    wx.previewImage({
      urls: img_arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})