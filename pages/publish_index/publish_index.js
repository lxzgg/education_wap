//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    windowWidth: '',
    navData: [],
    currentTab: 0,
    navScrollLeft: 0,
    today: '2018-08-30'
  },
  //事件处理函数
  onLoad: function () {
    let date = new Date()
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let today = date.getFullYear() + '-' + month + '-' + day
    util.wxpromisify({
      data: {},
      url: 'friend/getCateList',
      method: 'post'
    }).then(res => {
      const navData = res.list
      this.setData({
        navData,
        today
      })
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  onShow() {

  },
  goToPubliCircle(){
      wx.navigateTo({
          url: '/pages/public_circle/public_circle'
      })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    console.log(event.currentTarget.dataset.id);
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
})
