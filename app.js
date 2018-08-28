import api from './api/index'

App({
  api,

  onLaunch() {

    wx.login({
      success: res => {
        const code = res.code
        api.loginStatus({code}).then(res => {
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('user_id', res.data.user_id)
        })
      }
    })

  }
})
