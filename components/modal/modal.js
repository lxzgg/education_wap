let utils = require('../../utils/util.js')
const app = getApp();
Component({
  options: {

    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // // 弹窗标题
    // title: {            // 属性名
    //   type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //   value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    // },

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    status: false
  },
  attached() {

  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //判断是否已经授权
      if (app.user.auth_status) {
        this.setData({
          status: false
        })
      } else {
        this.setData({
          status: true
        })
      }
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    bindGetUserInfo(e) {

      if (e.detail.errMsg == "getUserInfo:ok") {
        wx.showLoading({
          title: '正在授权',
        })
        wx.login({
          success: (res) => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: (data) => {
                  new Promise((resolve, reject) => {
                    utils.wxpromisify({
                      url: "user/login",
                      data: {
                        code: res.code,
                        encryptedData: data.encryptedData,
                        iv: data.iv
                      },
                      method: 'post'
                    }).then((ret) => {
                      Object.assign(app.user, ret.data)
                      wx.setStorageSync('user', ret.data)
                      let unionid = ret.data.unionid
                      const userInfo_string = data.rawData
                      const userInfo = JSON.parse(userInfo_string)
                      utils.wxpromisify({
                        url: "user/updateUserInfo",
                        data: {
                          unionid: unionid,
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
                        wx.hideLoading()

                        if (res && res.response === 'data') {
                          this.setData({
                            status: false
                          })
                          wx.showToast({
                            icon: 'success',
                            title: '已授权',
                            duration: 3000
                          })
                          Object.assign(app.user, {
                            auth_status: true
                          })
                          wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), {
                            auth_status: true
                          }))
                        } else {
                          wx.showToast({
                            icon: 'none',
                            title: res.error.message,
                            duration: 3000
                          })
                        }
                      })
                    })
                  })
                },
                fail: (err) => {}
              })
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '已拒绝授权'
        })
      }
      //"getUserInfo:fail auth deny"
    },
    // 自定义组件向父组件传值 
    sendResultFormParent(data) {
      let val = data,
        my_event_detail = {
          ret: val
        }
      // myevent自定义名称事件，父组件中使用
      this.triggerEvent('myevent', my_event_detail)
      /*
       在父组件中写上bind:myevent="get_emit",在父组件中就需要调用get_emit事件
      */
    },
  }
})
