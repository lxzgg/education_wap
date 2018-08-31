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
    this.setData({
      options
    })
    this.getContent()
  },
  //获取发布内容详情
  getContent() {
    let articleid = this.data.options.articleid
    let type = this.data.options.type
    console.log(type)
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
      console.log(res)
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
        content_details.create_time = data.create_time
        // content_details.add_user = data.add_user
        eval_list = res.list
        if (res.list.length > 0) {
          //  eval_list = res.list.map((val,key)=>{
          //    let obj = {}
          //    obj.

          //   })
        }
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

  //评论提交
  formSubmit(e) {
    let comment = e.detail.value
    let articleid = this.data.options.articleid
    let type = this.data.options.type
    const params = {
      token: app.user.token,
      user_id: app.user.user_id,
      eval_info: comment
    }
    let url = type === 'index' ? 'article/article_eval' : 'friend/eval_content'
    if (type === 'index') {
      params.article_id = articleid
    } else {
      params.content_id = articleid
    }
    console.log(params)
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      this.getContent()
    })
  },
  //获取评论id ，显示回复框
  repyBtn(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      curInput: id
    })
  },

  //回复提交
  repyContent(e) {
    let repy = e.detail.value
    let curInput = this.data.curInput
    let type = this.data.options.type
    const params = {
      token: app.user.token,
      user_id: app.user.user_id,
      reply: repy
    }
    let url = type === 'index' ? 'article/eval_reply' : 'friend/eval_content'
    if (type === 'index') {
      params.eval_id = curInput
    } else {
      params.eval_id = curInput
    }
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      this.getContent()
    })
  }
})
