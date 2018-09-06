// pages/comment_area/comment_area.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "输入内容",
    clear:"",
    label:'提交评论'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let label = options.ret === 'eval' ? '提交评论' : '提交回复'
      let placeholder = options.ret === 'eval' ? '输入评论的文字' : '输入回复的文字'
    this.setData({
      options,
      label,
      placeholder
    })
  },
  formSubmit(e){
    let comment = e.detail.value.comment
    if(!comment){
        wx.showToast({
          title: '提交的内容不能为空',
          icon: 'none',
          duration: 5000
        })
        return
    }
    let ret = this.data.options.ret
     let id = this.data.options.id
     let type = this.data.options.type
    if(ret === 'eval'){
      this.submitEval(comment,id,type)
    }else{
        this.submitRepy(comment,id,type)
    }
  },
  //评论提交
  submitEval(comment,articleid,type) {
    // let comment = e.detail.value
    // let articleid = this.data.options.articleid
    // let type = this.data.options.type
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
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 3000
        })
        setTimeout(() => {
          wx.reLaunch({ //返回评论详情页面
            url: '/pages/comment/comment?articleid='+this.data.options.articleid+'&type='+this.data.options.type
          })
          this.setData({clear:''})
        },2000)

      } else {
        wx.showToast({
          title: '评论失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  //回复提交
 submitRepy(comment,curInput,type){
    const params = {
      token: app.user.token,
      user_id: app.user.user_id
    }
    let url = type === 'index' ? 'article/eval_reply' : 'friend/eval_reply'
    if (type === 'index') {
      params.eval_id = curInput
      params.reply = comment
    } else {
      params.eval_id = curInput
      params.eval_reply = comment
    }
    util.wxpromisify({
      url: url,
      data: params,
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '回复成功',
          icon: 'success',
          duration: 3000
        })
        setTimeout(() => {
          wx.navigateTo({ //返回评论详情页面
            url: '/pages/comment/comment?articleid='+this.data.options.articleid+'&type='+this.data.options.type
          })
        this.setData({clear:''})
        }, 2000)
      } else {
        wx.showToast({
          title: '回复失败',
          icon: 'none',
          duration: 3000
        })
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
