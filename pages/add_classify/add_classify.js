// pages/add_classify/add_classify.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    icon_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.wxpromisify({
      url: 'class_info/getIcon',
      data: {
        // user_id: app.user.user_id,
        // token: app.user.token,
        // class_id: app.user.class_id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let list = res.list
        this.setData({
          list
        })
      }
    })
  },
  selectIcon(e) {
    let icon_id = e.currentTarget.dataset.id
    this.setData({
      icon_id
    })
  },
  formSubmit(e) {
    let cate_name = e.detail.value.cate_name
    if (!cate_name) {
      wx.showToast({
        title: '请填写图标名称',
        icon: 'none',
        duration: 5000
      })
      return
    }
    util.wxpromisify({
      url: 'class_info/addCate',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        class_id: app.user.class_id,
        cate_icon: this.data.icon_id,
        cate_name
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '图标添加成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/classify_maintain/classify_maintain'
          })
        }, 2000)
         } else {
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err)=>{
       wx.showModal({
          title: '提示',
          content: '请求超时',
          showCancel: false,
          success: ()=> {
           
          }
        })
    })
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
