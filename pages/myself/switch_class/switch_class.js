const app = getApp()
let utils = require('../../../utils/util')

Page({

  data: {
    class_list: [],
    isEmpty: true,
    selIndex:''
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
          class_list: res.list,
          isEmpty: false
        })
      }else{

      }
    })
  },
  goToAddClass() {
    wx.navigateTo({
      url: '/pages/myself/add_class/add_class'
    })
  },

  switchClass(e) {
    let class_id = e.currentTarget.dataset.classid
   this.setData({selIndex: class_id})
  }
})
