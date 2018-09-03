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
    currentPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getArticle()

  },
  //获取文章列表
  getArticle() {
    utils.wxpromisify({
      url: 'index/article',
      data: {
        page: this.data.currentPage,
        token: app.user.token,
        num: this.data.pageSize,
        user_id: app.user.user_id,
        class_id: app.user.class_id,
        article_type: options.type
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        const inform_list = inform_list
        inform_list.push.apply(inform_list,res.list)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
        currentPage : page+1
      })
      this.getArticle()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
