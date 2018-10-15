const app = getApp()
const utils = require('../../utils/util')
Page({
  data: {
center_detail:[]
  },
  onLoad: function (options) {
    let id = options.id
    utils.wxpromisify({
      url: 'help/help_detail',
      data: {
        id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({center_detail: res.data.images})
      } else {
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      wx.showModal({
        title: '提示',
        content: '请求超时',
        showCancel: false
      })
    })
  },
  previewImage(){
    let img_arr = this.data.center_detail
    wx.previewImage({
      urls: img_arr // 需要预览的图片http链接列表
    })
  }
})