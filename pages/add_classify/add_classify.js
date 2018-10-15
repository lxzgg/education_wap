const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    list: [],
    icon_id: "",
    cate_name: "",
    id:''
  },
  onLoad: function (options) {
    util.wxpromisify({
      url: 'class_info/getIcon',
      data: {},
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let list = res.list
        this.setData({
          list
        })
      }
    }).then(() => {
      if (options) {
      wx.setNavigationBarTitle({
        title: '编辑分类'
      })
        let list = this.data.list,
          index = 0
        list.forEach((val, key) => {
          if (val.iconSrc === options.cate_icon) {
            index = key
          }
        })
        let icon_id = list[index].icon_id
        this.setData({
          cate_name: options.cate_name,
          icon_id,
          id: options.cate_id
        })
      }
    })
  },
  selectIcon(e) {
    let icon_id = e.currentTarget.dataset.id
    this.setData({
      icon_id
    })
  },
  formSubmit(e) {
    let cate_name = e.detail.value.cate_name
    if (!cate_name) {
      wx.showToast({
        title: '请填写图标名称',
        icon: 'none',
        duration: 5000
      })
      return
    }
    util.wxpromisify({
      url: 'class_info/addCate',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        class_id: app.user.class_id,
        cate_icon: this.data.icon_id,
        cate_name,
        id: this.data.id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/classify_maintain/classify_maintain'
          })
        }, 2000)
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
        showCancel: false,
        success: () => {
        }
      })
    })
  }
})
