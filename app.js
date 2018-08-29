import api from './api/index'

App({
  api,

  // 用户信息
  user: {},

  onLaunch() {
    // 登陆
    wx.showLoading({title: '加载中'})
    new Promise((resolve) => {
      wx.login({
        success: res => {
          resolve(res)
        }
      })
    }).then(res => {
      const code = res.code
      return api.loginStatus({code})
    }).then(res => {
      // 用户信息全局保存
      this.user = res.data
      wx.setStorage({key: 'user', data: res.data})
      wx.switchTab({url: '/pages/index/index'})
      wx.hideLoading()
    })
  }
})
