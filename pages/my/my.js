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
    roleName:''
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
  onShow(){
   // console.log('加载')
    let is_admin = app.admin_auth[app.user.is_admin] +'/'+app.user_role[app.user.user_role]
    // console.log(app.user.is_admin,app.user.user_role)
    this.setData({roleName: is_admin})
    util.wxpromisify({
      url: 'user/userInfo',
      data: app.user,
      method: 'post'
    }).then((ret) => {
      if (ret.response == 'data') {
        this.setData({
          nickname: ret.data.nickname,
          imageUrl: ret.data.avatarUrl
        })
      }
    }).catch((err) => {})
  },
   //显示对话框
  showModal: function () {
    // wx.showToast({

    // })
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
