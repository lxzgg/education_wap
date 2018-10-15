// pages/screen_count/screen_count.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 1,
    options: {},
    count: {
      noBrowser: 0,
      browser: 0
    },
    personlist: [],
    message: '暂无数据',
  },
  switchReadStatus(e) {
    let curIndex = e.currentTarget.dataset.index
    this.setData({
      curIndex
    })
    this.getScreenPer()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    })
    this.getScreenContent()
    this.getScreenPer()
  },
  getScreenPer() {
    let check_type = this.data.options.type ? 'article' : 'content'
    utils.wxpromisify({
      data: {
        article_id: this.data.options.articleid,
        type: this.data.curIndex,
        check_type: check_type
      },
      url: 'index/browser',
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        const personlist = res.list
        const count = res.data
        this.setData({
          personlist,
          count
        })
      } else {
        const message = res.error.message
        this.setData({
          message,
          personlist: []
        })
      }
    })
  },
  getScreenContent() {
    let bool = this.data.options.type ? true : false
    //type有值表示我的发布 ，,否则是家长圈发布
    let url = bool ? 'article/article_detail' : 'friend/contentDetail'
    let params = {
      user_id: app.user.user_id,
      token: app.user.token,
    }
    if (bool) {
      params.article_id = this.data.options.articleid
    } else {
      params.content_id = this.data.options.articleid
    }
    utils.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let options = this.data.options
        if (bool) {
          options.content = res.data.article_content
        } else {
          options.content = res.data.content
        }
        this.setData({
          options
        })
      }
    })
  }
})
