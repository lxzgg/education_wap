// pages/account/account.js
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
     canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //  userInfo:{},
     encryptedData:'',
     iv:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// 查看是否授权
let that = this
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                encryptedData:res.encryptedData,
                iv: res.iv
              })
            }
          })
        }
      }
    })
  },
 bindGetUserInfo: function(e) {
    // console.log(e.detail.userInfo)
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
  
  },
  goToForget(){
    wx.navigateTo({
      url:'../forget_pass/forget_pass'
    })
  },
  goToRegister(){
     wx.navigateTo({
      url:'../register/register'
    })
  },
 formSubmit(e){
    // let formData = e.detail.value
    // let phone = formData.phone.trim()
    // let password = formData.password.trim()
   
    // wx.switchTab({
    //   url: '/pages/index/index',
    // })
    // console.log(e)
 
    // if(!phone){
    //   wx.showToast({
    //     title: '请输入验证码',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    // if(!password){
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
    // if(password.length< 6){
    //   wx.showToast({
    //     title: '密码不得少于6位数',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
    // let bool = this.isPoneAvailable(phone)
    // if(!bool){
    //   wx.showToast({
    //     title: '无效手机号码',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
    // return
    // console.log(this.data.userInfo)
    util.wxpromisify({
      url:'user/login',
      data: { code: 'admin', encryptedData: this.data.encryptedData, iv:this.data.iv},
      method:'post'
    }).then((res)=>{
      console.log(res)
    }).catch((error)=>{
      console.log(error)
    })
  },
  isPoneAvailable(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
  }
})