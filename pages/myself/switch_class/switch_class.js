const app = getApp()
let utils = require('../../../utils/util')

Page({
  data: {
    class_list: [],
    isEmpty: true,
    selClassId: ''
  },
  onLoad: function (options) {
    utils.wxpromisify({
      url: 'class_info/classList',
      data: {
        user_id: app.user.user_id,
        token: app.user.token
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        this.setData({
          class_list: res.list,
          isEmpty: false
        })
      } else {}
    })
  },
  goToAddClass() {
    wx.navigateTo({
      url: '/pages/myself/add_class/add_class'
    })
  },

  switchClass(e) {
    let class_id = e.currentTarget.dataset.classid
    this.setData({
      selClassId: class_id
    })
  },
  formSubmit(e) {
    utils.wxpromisify({
      url: 'class_info/changeClass',
      data: {
        token: app.user.token,
        class_id: this.data.selClassId,
        user_id: app.user.user_id
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          success: function (res) {
            new Promise((resolve) => {
              wx.login({
                success: res => {
                  resolve(res)
                }
              })
            }).then(res => {
              const code = res.code
              return app.api.loginStatus({
                code
              })
            }).then(res => {
              // 用户信息全局保存
               wx.showToast({
                title: '切换成功',icon:'success'
              })
              Object.assign(app.user, res.data)
              wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), res.data))
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }).catch(() => {
              wx.showToast({
                title: '初始化失败'
              })
            }).then(() => {
              wx.switchTab({
                url: '/pages/my/my'
              })
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'fail',
          duration: 5000,
          success: function (res) {}
        })
      }
    })
  }
})
