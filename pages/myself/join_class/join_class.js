// pages/myself/invit_teacher/invit_teacher.js
const app = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selShipIndex: 1,
    showShipInput: false,
    mobile:'',
    Relationship: [{
        family_role: 1,
        family_role_name: '爸爸'
      },
      {
        family_role: 2,
        family_role_name: '妈妈'
      },
      {
        family_role: 3,
        family_role_name: '爷爷'
      },
      {
        family_role: 4,
        family_role_name: '奶奶'
      },
      {
        family_role: 5,
        family_role_name: '外公'
      },
      {
        family_role: 6,
        family_role_name: '外婆'
      },
      {
        family_role: 7,
        family_role_name: '其他'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.handle && options.handle == 'joinClass') {
      //获取当前打开页面的微信的user_id
      new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            resolve(res.code)
          },
          fail: err => {}
        })
      }).then((res) => {
        return utils.wxpromisify({
          url: 'user/loginStatus',
          data: {
            code: res
          },
          method: 'post'
        })
      }).then((res) => {
        if (res && res.response === 'data') {
          Object.assign(app.user, res.data)
          wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), res.data))
        }
      })
    }
  },

  //亲属关系切换
  switchFamilyShip(e) {
    let num = e.currentTarget.dataset.num
    let showShipInput = this.data.showShipInput
    if (num === 7) {
      showShipInput = showShipInput ? false : true
    } else {
      showShipInput = false
    }
    this.setData({
      selShipIndex: num,
      showShipInput: showShipInput
    })
  },
  //表单提交
  formSubmit(e) {
    let mobile = e.detail.value.mobile
    let child_name = e.detail.value.child_name
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!child_name) {
      wx.showToast({
        title: '请输入孩子姓名',
        icon: 'none',
        duration: 5000
      })

    }
    const bool = this.isPoneAvailable(mobile)
    if (!bool) {
      wx.showToast({
        title: '请正确填写手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let keys = this.data.selShipIndex
    let familyObj = {}
    familyObj.family_role = this.data.selShipIndex
    if (keys == '7') {
      const family_role_name = e.detail.value.family_role_name
      familyObj.family_role_name = family_role_name
    }
    const params = {
      mobile,
      child_name,
      ...familyObj,
      user_id: app.user.user_id,
      token: app.user.token,
      class_id: app.user.class_id
    }
    utils.wxpromisify({
      url: 'user/addFamily',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 2000)
      } else {
        wx.showModal({
          title: '提示',
          content: res.error.message,
          showCancel: false,
          success: function () {
            wx.navigateTo({
               url: '/pages/index/index'
            })
          }
        })
      }
    }).catch((err)=>{
       wx.showModal({
          title: '提示',
          content: '请求超时',
          showCancel: false,
          success: function () {
            wx.navigateTo({
               url: '/pages/index/index'
            })
          }
        })
    })
  },
  //手机号码验证
  isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '邀请您加入班级',
      desc: '分享页面的内容',
      path: 'pages/myself/join_class/join_class?handle=joinClass' // 路径，传递参数到指定页面。
    }
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
  }

})
