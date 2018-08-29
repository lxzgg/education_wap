const app = getApp()
let utils = require('../../../utils/util')

Page({

  data: {
    class_list: []
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
          class_list: res.list
        })
      }
    })
  },

  goToAddClass() {
    wx.navigateTo({
      url: '/pages/myself/add_class/add_class'
    })
  },

  switchClass(e) {
    let class_id = e.details.value.classid
    console.log(class_id)
  }
})
