let utils = require('../../../utils/util')
const app = getApp()

Page({

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
      }
    ],
    region: ['广东省', '广州市', '海珠区']
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
          success: function (e) {
            wx.switchTab({
              url: '../../index/index'
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

  // 获取用户手机号码
  getPhoneNumber(e) {
    const {encryptedData, iv} = e.detail
    wx.login({
      success: res => {
        const code = res.code
        app.api.getPhoneNumber({code, encryptedData, iv}).then(res => {
          console.log(res)
        })
      }
    })
  },

  isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(str)) {
      return false
    } else {
      return true
    }
  }

})
