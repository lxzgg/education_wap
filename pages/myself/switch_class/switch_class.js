// pages/myself/switch_class/switch_class.js
const app = getApp()
let utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_list: [],
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.wxpromisify({
      url: 'class_info/classList',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        this.setData({
          class_list: res.list
        })
      }else{

      }
    })

  },
  goToAddClass() {
    wx.navigateTo({
      url: '/pages/myself/add_class/add_class'
    })
  },
  switchClass(e){
    let class_id = e.details.value.classid
    console.log(class_id)
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
