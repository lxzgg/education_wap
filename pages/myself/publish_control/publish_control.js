// pages/myself/publish_control/publish_control.js
const app = getApp()
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: [],
    totalPage: 1,
    pageSize: 10,
    currentPage: 1
  },
  onLoad: function () {
    this.getArticle()
  },
  getArticle() {
    util.wxpromisify({
      url: 'article/articleList',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        page: this.data.currentPage,
        num: this.data.pageSize
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let article = this.data.article
        article.push.apply(article, res.list)
        this.setData({
          article
        })
      }
    })
  },
  //开启/禁止评论
  switchCommentAuth(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let can_comment = article[key].can_comment //当前评论权限
    article[key].can_comment = article[key].can_comment == '1' ? 0 : 1 //修改后的评论权限
    util.wxpromisify({
      url: 'article/evalStatus',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          article
        })
      }
    })
  },
  //是否置顶
  switchTopAuth(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let is_top = article[key].is_top //当前评论权限
    article[key].is_top = parseInt(article[key].is_top) === 1 ? 0 : 1 //修改后的评论权限
    util.wxpromisify({
      url: 'article/topStatus',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          article
        })
      }
    })
  },

  //跳转到文章统计页面
  goToCount(e) {
    const articleid = e.currentTarget.dataset.articleid
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/screen_count/screen_count?articleid=' + articleid + '&type=' + type
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
    if (page > totalPage) {
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
  }
})
