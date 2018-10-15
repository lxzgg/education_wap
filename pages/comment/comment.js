// pages/comment/comment.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_details: [],
    eval_list: [],
    options: {},
    info: '',
    curInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      options
    })
    this.getContent()
  },
  //获取发布内容详情
  getContent() {
    let articleid = this.data.options.articleid
    let type = this.data.options.type
    const params = {
      token: app.user.token,
      user_id: app.user.user_id,
    }
    //index 类型为第二个导航发布的内容， firend类型为家长圈发布的内容
    let url = type === 'index' ? 'article/article_detail' : 'friend/contentDetail'
    if (type === 'index') {
      params.article_id = articleid
    } else {
      params.content_id = articleid
    }
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      let content_details = {},
        eval_list = []
      if (type === 'firend') {
        const data = res.data
        content_details.article_id = data.id
        content_details.article_content = data.content
        content_details.article_accessory = data.accessory
        content_details.avatarUrl = data.head_img
        content_details.nickname = data.add_user
        content_details.like_num = data.like_num
        content_details.is_remard = data.is_remard
        content_details.create_time = data.create_time
        // content_details.add_user = data.add_user
        eval_list = res.list
      } else {
        content_details = res.data
        eval_list = res.list
      }

      this.setData({
        eval_list,
        content_details,
        info: '', //清空评论的内容
        curInput: '' //清空刚刚回复的id项
      })
    })
  },
  goToCommentArea(e) {
    wx.navigateTo({
      url: '/pages/comment_area/comment_area?articleid=' + this.data.options.articleid + '&id=' + e.currentTarget.dataset.id + '&type=' + this.data.options.type + '&ret=' + e.currentTarget.dataset.ret
    })
  },
  //点赞
  clickZan(e) {
    const type = this.data.options.type
    const articleid = e.currentTarget.dataset.articleid
    let content_details = this.data.content_details
    let is_zan = content_details.is_remard
    content_details.is_remard = content_details.is_remard == '1' ? 0 : 1
    content_details.like_num = content_details.is_remard == '1' ? parseInt(content_details.like_num) + 1 : parseInt(content_details.like_num) - 1
    let url = type === 'index' ? 'article/like_article' : 'friend/like_content'
    let params = {
      token: app.user.token,
      user_id: app.user.user_id
    }
    if (type === 'index') {
      params.article_id = articleid
    } else {
      params.content_id = articleid
    }
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      this.setData({
        content_details
      })
    })
  },
  onShareAppMessage() {
    return {
      title: '分享内容',
      imageUrl: '/image/xiaohaoge.png',
      path: 'pages/public_index/public_index' // 路径，传递参数到指定页面。
    }
  }
})
