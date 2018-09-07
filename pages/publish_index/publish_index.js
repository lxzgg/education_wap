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
    totalPage: 0,
    pageSize: 10,
    currentPage: 1,
    today: '2018-08-30',
    banner: ''
  },
  //事件处理函数
  onLoad: function () {
    let date = new Date()
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let today = date.getFullYear() + '-' + month + '-' + day

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
    this.init()
  },
  init() {
    this.getFirendBanner()
    this.getCateContent()
    this.getFirendContent()
  },
  //获取分类内容
  getCateContent() {
    util.wxpromisify({
      data: {},
      url: 'friend/getCateList',
      method: 'post'
    }).then(res => {
      const navData = res.list
      this.setData({
        navData
      })
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
    var cur = event.currentTarget.dataset.id;
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
      this.setData({
        content_list: []
      })
      this.getFirendContent()

    }
  },
  //获取家长圈内容列表
  getFirendContent() {
    util.wxpromisify({
      data: {
        cate_id: this.data.currentTab,
        page: this.data.currentPage,
        num: this.data.pageSize,
        user_id: app.user.user_id,
        token: app.user.token
      },
      url: 'friend/contentList',
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let content_list = this.data.content_list
        content_list.push(...res.list)
        this.setData({
          content_list
        })
      } else {
        this.setData({
          content_list: []
        })
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  //点赞
  bindZan(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.id
    let content_list = this.data.content_list
    let is_zan = content_list[key].is_remard
    content_list[key].is_remard = content_list[key].is_remard == '1' ? 0 : 1
    content_list[key].like_num = content_list[key].is_remard == '1' ? parseInt(content_list[key].like_num) + 1 : parseInt(content_list[key].like_num) - 1
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
  },

  //上拉加载
  onReachBottom: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    let page = this.data.currentPage
    let totalPage = this.data.totalPage
    wx.hideLoading()
    if (page >= totalPage) {
      wx.showToast({
        title: '没有更多数据了',
        duration: 3000,
        icon: 'none'
      })
    } else {
      this.setData({
        currentPage: page + 1
      })
      this.getFirendContent()
    }
  },
  onShareAppMessage() {
    return {
      title: '分享家长圈内容',
      imageUrl: '/image/xiaohaoge.png',
      path: 'pages/public_index/public_index' // 路径，传递参数到指定页面。
    }
  },
  getFirendBanner() {
    util.wxpromisify({
      url: 'friend/banner',
      data: {
        class_id: app.user.class_id
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          banner: res.data.banner
        })
      }
    })
  }
})
