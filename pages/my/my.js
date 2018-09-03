// pages/my/my.js
let util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    nickname: '',
    showModalStatus: false,
    roleName: '',
    loginAuth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goToPersonInfo() {
    wx.navigateTo({
      url: '/pages/personData/personData'
    })
  },
  getUserInfo() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: false,
            success: (data) => {
              const userInfo_string = data.rawData
              const userInfo = JSON.parse(userInfo_string)
              util.wxpromisify({
                url: "user/updateUserInfo",
                data: {
                  user_id: app.user.user_id,
                  token: app.user.token,
                  city: userInfo.province,
                  nickname: userInfo.nickName,
                  gender: userInfo.gender,
                  language: userInfo.language,
                  avatarUrl: userInfo.avatarUrl
                },
                method: 'post'
              }).then((res) => {
                if (res && res.response === 'data') {
                  // Object.assign(app.user, {islogin:1})
                  // wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), {islogin:1}))
                  this.onShow()
                }

              })
            },
            fail: (err) => {}
          })
        }
      }
    })
  },
  onShow() {
    // console.log('加载')
    let is_admin = app.admin_auth[app.user.is_admin] + '/' + app.user_role[app.user.user_role]
    // console.log(app.user.is_admin,app.user.user_role)
    this.setData({
      roleName: is_admin
    })
    util.wxpromisify({
      url: 'user/userInfo',
      data: app.user,
      method: 'post'
    }).then((ret) => {
      if (ret.response == 'data') {
        this.setData({
          nickname: ret.data.nickname,
          imageUrl: ret.data.avatarUrl,
          // loginAuth: app.user.islogin
        })
      }
    }).catch((err) => {})
  },
  //显示对话框
  showModal: function () {
    // wx.showToast({

    // })
    util.wxpromisify({
      url: 'index/qrcode',
      data: {
        scene: '', //参数
        pages: 'pages/index/index', //string 
        width: '', //二维码宽度
        auto_color: '', //自动配置线条颜色 bool
        line_color: '', //{r:'',g:'',b:''}
        is_hyaline: '' //是否需要透明色 bool
      },
      method: 'post'
    }).then(res => {
      console.log(res)
    })


    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).top()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    // animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

})
