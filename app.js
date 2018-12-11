import api from './api/index'

App({
  api,
  // 用户信息
  user: {},
  admin_auth: ['非管理员', '班主任','家委会'],
  user_role: ['游客', '老师', '家长'],
  onLaunch(options) {
    let scene = encodeURIComponent(options.scene)
    const code = ['1047', '1048', '1049', '1007', '1008'] //通过识别二维码，扫描二维码，相册中选择二维码识别途径的，不跳转到首页，直接跳转到指定页面
    let bool = code.indexOf(scene) > -1 ? false : true
    if (bool) { //微信小程序当前支持的场景值
      // 登陆
      wx.showLoading({
        title: '加载中'
      })
      new Promise((resolve) => {
        wx.login({
          success: res => {
            resolve(res)
          }
        })
      }).then(res => {
        const code = res.code
        return api.loginStatus({
          code
        })
      }).then(res => {
        // 用户信息全局保存
        this.user = res.data
        wx.setStorage({
          key: 'user',
          data: res.data
        })
        wx.switchTab({
         // url: '/pages/index/index'
        })
        wx.hideLoading()
      }).catch(() => {
        wx.showToast({
          title: '初始化失败'
        })
      })
    }
  }
})
