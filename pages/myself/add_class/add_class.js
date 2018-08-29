const app = getApp()

Page({

  data: {
    // 默认教师
    admin_type: 1,
    city: ['广东省', '深圳市', '南山区']
  },

  radioChange(e) {
    this.setData({admin_type: e.detail.value})
  },

  bindRegionChange(e) {
    this.setData({city: e.detail.value})
  },

  // 提交
  submit() {
    const {mobile, class_name, city, admin_type} = this.data
    const reg = /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[1235678]|18[0-9]|19[89])\s?[0-9]{4}\s?[0-9]{4}$/
    if (!class_name) {
      return wx.showToast({title: '请填写班级名称', icon: 'none'})
    } else if (!reg.test(mobile)) {
      return wx.showToast({title: '请填写正确的手机号码', icon: 'none'})
    }
    app.api.home.addClass({
      user_id: app.user.user_id,
      token: app.user.token,
      mobile,
      class_name,
      city,
      admin_type
    }).then(res => {
      Object.assign(app.user, res.data)
      wx.switchTab({url: '/pages/index/index'})
      wx.showToast({title: '班级创建成功'})
    })
  },

  // 获取用户手机号码
  getPhoneNumber(e) {
    const {encryptedData, iv} = e.detail
    wx.login({
      success: res => {
        const code = res.code
        app.api.getUserMobile({code, encryptedData, iv}).then(res => {
          const mobile = res.data.mobile
          this.setData({mobile})
        })
      }
    })
  },

  /**
   * 表单数据绑定
   */
  getInput(e) {
    const name = e.currentTarget.dataset.name
    const val = e.detail.value

    this.setData({
      [name]: val
    })
  }

})
