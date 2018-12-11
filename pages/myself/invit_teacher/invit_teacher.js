// pages/myself/invit_teacher/invit_teacher.js
const app = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selSubIndex: '',
    showObjInput: false,
    classInfo: {},
    invit_class_id: '',
    mobile: '',
    workItem: [{
        subject_type: 1,
        subject_name: '语文'
      },
      {
        subject_type: 3,
        subject_name: '数学'
      },
      {
        subject_type: 2,
        subject_name: '英语'
      },
      {
        subject_type: 4,
        subject_name: '生活'
      },
      {
        subject_type: 5,
        subject_name: '艺术'
      }, {
        subject_type: 7,
        subject_name: '家委'
      }, {
        subject_type: 6,
        subject_name: '其他'
      }
    ]
  },
  switchSubject(e) {
    let num = e.currentTarget.dataset.num
    let showObjInput = this.data.showObjInput
    if (num === 6) {
      showObjInput = showObjInput ? false : true
    } else {
      showObjInput = false
    }
    this.setData({
      selSubIndex: num,
      showObjInput: showObjInput
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let invit_class_id = options.class_id
    if (options.handle && options.handle == 'invitTeacher') {
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
          this.setData({
            invit_class_id
          })
          let data = res.data
          data.class_id = invit_class_id
          Object.assign(app.user, data)
          wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), data))
        }
        // resolve()
      }).then(() => {
        //获取当前班级信息
        return utils.wxpromisify({
          url: 'class_info/info',
          data: {
            token: app.user.token,
            user_id: app.user.user_id,
            class_id: invit_class_id
          },
          method: 'post'
        })
      }).then((res) => {
        if (res && res.response === 'data') {
          const classInfo = res.data
          this.setData({
            classInfo
          })
        }
      })
    }
  },

  formSubmit(e) {
    let mobile = e.detail.value.mobile
    let username = e.detail.value.username
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!username) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 5000
      })
      return 
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
    let keys = this.data.selSubIndex
    if(!keys){
      wx.showToast({
        title: '请选择所任职务',
        icon: 'none',
        duration: 5000
      })
      return 
    }
    let subObj = {}
    subObj.subject_type = this.data.selSubIndex
    if (keys == '6') {
      const other_subject_name = e.detail.value.subject_name
      subObj.other_subject = other_subject_name
    }else{
      subObj.other_subject = this.data.workItem[keys].subject_name
    }
    const params = {
      mobile,
      username,
      ...subObj,
      user_id: app.user.user_id,
      token: app.user.token,
      class_id: this.data.invit_class_id
    }
   // console.log(JSON.stringify(params))
    utils.wxpromisify({
      url: 'user/addTeacher',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '邀请成功',
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
          }
        })
      }
    }).catch((err) => {
      wx.showModal({
        title: '提示',
        content: '请求超时',
        showCancel: false,
        success: function () {
        }
      })
    })
  },
  isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: '邀请您加入班级',
      desc: '分享页面的内容',
      path: 'pages/myself/invit_teacher/invit_teacher?handle=invitTeacher&class_id=' + app.user.class_id // 路径，传递参数到指定页面。
    }
  },

  // 获取用户手机号码
  getPhoneNumber(e) {
    const {
      encryptedData,
      iv
    } = e.detail
    wx.login({
      success: res => {
        const code = res.code
        app.api.getUserMobile({
          code,
          encryptedData,
          iv
        }).then(res => {
          const mobile = res.data.mobile
          this.setData({
            mobile
          })
        })
      }
    })
  },
})
