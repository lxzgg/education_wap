// pages/myself/add_class/add_class.js
let utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioCheckVal: 1,
    position_list: [{
        name: 1,
        value: '教师',
        checked: true
      },
      {
        name: 2,
        value: '家长'
      },
    ],
    region: ['广东省', '广州市', '海珠区'],
    //   customItem: '全部'
  },
  radioChange: function (e) {
    this.setData({
      radioCheckVal: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    let class_name = e.detail.value.classname.trim()
    let tel = e.detail.value.tel.trim()
    if (!class_name) {
      wx.showToast({
        title: '请输入班级名称',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!tel) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let isAble = this.isPoneAvailable(tel)
    if (!isAble) {
      wx.showToast({
        title: '手机格式不正确',
        icon: 'none',
        duration: 5000
      })
      return
    }
    var params = {
      user_id: wx.getStorageSync('userInfo').user_id,
      token: wx.getStorageSync('userInfo').token,
      class_name: class_name,
      admin_type: this.data.radioCheckVal,
      mobile: tel,
      city: this.data.region.toString()
    }
    utils.wxpromisify({
      url: 'class_info/addClass',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showModal({
          title: '提示',
          content: '班级创建成功',
          showCancel: false,
          success: function(e){
              wx.switchTab({
                  url:'../../index/index'
              })
          }
        })
        wx.setStorageSync('class_id', res.data.class_id)
      } else {
        wx.showModal({
          title: '提示',
          content: '班级创建失败',
          showCancel: false
        })
      }
    })

  },
  getPhoneNumber() {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求  
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
