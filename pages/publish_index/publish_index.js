//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    windowWidth: '',
    navData: [],
    currentTab: 'all',
    content_list: [],
    navScrollLeft: 0,
    is_zan: false,
    today: '2018-08-30'
  },
  //事件处理函数
  onShow: function () {
    let date = new Date()
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let today = date.getFullYear() + '-' + month + '-' + day
    this.getContent()
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          today
        })
      }
    })
  },
  //获取分类内容
  getContent() {
    util.wxpromisify({
      data: {},
      url: 'friend/getCateList',
      method: 'post'
    }).then(res => {
      const navData = res.list
      this.setData({
        navData
      })
    }).then(() => {
      this.getFirendContent()
    })
  },
  //跳转到发布页面
  goToPubliCircle() {
    wx.navigateTo({
      url: '/pages/public_circle/public_circle'
    })
  },
  //切换标签
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    this.getFirendContent()
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //获取家长圈内容列表
  getFirendContent() {
    util.wxpromisify({
      data: {
        cate_id: this.data.currentTab,
        page: 1,
        num: 20,
        user_id: app.user.user_id,
        token: app.user.token
      },
      url: 'friend/contentList',
      method: 'post'
    }).then(res => {
      this.setData({
        content_list: res.list
      })
    })
  },
  //点赞
  bindZan(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.id
    let content_list = this.data.content_list
    let is_zan = content_list[key].is_remard
    if (is_zan == '1') {
      return
    }
    content_list[key].is_remard = content_list[key].is_remard === 1 ? 0 : 1
    content_list[key].like_num = parseInt(content_list[key].like_num) + 1
    util.wxpromisify({
      url: 'friend/like_content',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        content_id: articleid
      },
      method: 'post'
    }).then(res => {
      this.setData({
        content_list
      })
    })
  },

  //跳转到评论内容
  bindComment(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?articleid=' + id + '&type=firend'
    })
  }
})
