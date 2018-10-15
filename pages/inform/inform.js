// pages/inform/inform.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inform_list: [],
    isEmpty: true,
    totalPage: 0,
    pageSize: 10,
    currentPage: 1,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      options,
      inform_list: []
    })
    this.getArticle()
  },
  //获取文章列表
  getArticle() {
    let params = {
      page: this.data.currentPage,
      token: app.user.token,
      num: this.data.pageSize,
      user_id: app.user.user_id,
    }
    let url = this.data.options.is_platform == 'true' ? 'index/platformList' :'index/article'
    if (this.data.options.is_platform != 'true') {
      params.class_id = app.user.class_id,
      params.article_type = this.data.options.type
    }
    utils.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        const inform_list = this.data.inform_list
        inform_list.push(...res.list)
        this.setData({
          inform_list,
          isEmpty: false
        })
      }
    })
  },
  clickZan(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let inform_list = this.data.inform_list
    let is_zan = inform_list[key].is_remard
    if (is_zan == '1') {
      return
    }
    inform_list[key].is_remard = inform_list[key].is_remard === 1 ? 0 : 1
    inform_list[key].like_num = parseInt(inform_list[key].like_num) + 1
    utils.wxpromisify({
      url: 'article/like_article',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      this.setData({
        inform_list
      })
    })
  },
  goToComment(e) {
    let article_id = e.currentTarget.dataset.articleid
    wx.navigateTo({
      url: '/pages/comment/comment?articleid=' + article_id + '&type=index'
    })
  },

  //跳转到浏览统计页面
  goToScreenCount(e) {
    let article_id = e.currentTarget.dataset.articleid
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/screen_count/screen_count?articleid=' + article_id + '&type=' + type
    })
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
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
      this.getArticle()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '给你分享一个' + this.data.type,
      imageUrl: '/image/xiaohaoge.png',
      path: 'pages/index/index' // 路径，传递参数到指定页面。
    }
  }
})
