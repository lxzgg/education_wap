const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    isSort: 0,
    list: []
  },
  down(e) {
    let index = e.currentTarget.dataset.index
    let temp_list = this.data.list
    let temp_item = temp_list.splice(index, 1)[0]
    temp_list.splice(index + 1, 0, temp_item)
    this.setData({
      list: temp_list
    })
  },
  up(e) {
    let index = e.currentTarget.dataset.index
    let temp_list = this.data.list;
    let temp_item = temp_list.splice(index, 1)[0]
    temp_list.splice(index - 1 < 0 ? 0 : index - 1, 0, temp_item)
    this.setData({
      list: temp_list
    })
  },
  // 开启弹窗
  openDo(e) {
    let index = e.currentTarget.dataset.index
    let cate = this.data.list[index]
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: (res) => {
        if (res.tapIndex === 1) {
          util.wxpromisify({
            url: 'class_info/del_cate',
            data: {
              user_id: app.user.user_id,
              token: app.user.token,
              id: cate.cate_id
            },
            method: 'post'
          }).then(res => {
            if (res && res.response === 'data') {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.data.list.splice(index, 1)
                this.setData({
                  list: this.data.list
                })
              }, 2000)
            }
          })
        } else if (res.tapIndex === 0) {
          wx.navigateTo({
            url: '/pages/add_classify/add_classify?cate_name=' + cate.cate_name + '&cate_id=' + cate.cate_id + '&cate_icon=' + cate.cate_icon
          })
        }
      },
      fail: (res) => {}
    })
  },
  // 开启排序
  setSort(e) {
    let num = e.currentTarget.dataset.num
    if (num == '0') { //完成
      let lists = this.data.list
      let arr = [],
        sort = []
      lists.forEach((val, key) => {
        arr.push(val.cate_id)
        sort.push(key + 1)
      })
      let params = {
        cate_id: arr.toString(),
        sort_num: sort.toString()
      }
      this.submitScort(params)
    }

    this.setData({
      isSort: num
    })
  },
  onLoad: function (options) {
    util.wxpromisify({
      url: 'class_info/cateList',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        class_id: app.user.class_id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let list = res.list
        this.setData({
          list
        })
      }
    })
  },
  addClassIcon() {
    wx.redirectTo({
      url: '/pages/add_classify/add_classify'
    })
  },
  submitScort(params) {
    util.wxpromisify({
      url: 'class_info/cateSort',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        class_id: app.user.class_id,
        ...params
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
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
        showCancel: false
      })
    })
  }
})
