const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    isEmpty: true,
    adList:[{ad_image:'../../image/banner1.jpg'}]
  },


  onShow() {
    this.init()
  },

  init() {
    this.getBanner()
    this.getArticle()
    this.cateList()
  },


  /********************api********************/

  // 获取轮播
  getBanner() {
    app.api.home.adList({ ...app.user
    }).then(res => {
      if(res && res.response === 'data'){
        this.setData({
          adList:[]
        })
 this.setData({
        adList: res.list
      })
      }
     
    })
  },

  // 获取文章列表
  getArticle() {
    app.api.home.article({
      page: 1,
      token: app.user.token,
      num: 50,
      user_id: app.user.user_id,
      class_id: app.user.class_id,
      article_type: ''
    }).then(res => {
      if (res.response === 'data') {
        this.setData({
          article: res.list,
          isEmpty: false
        })
      }
    })
  },
  // 首页分类列表
  cateList() {
    app.api.home.cateList({
      token: app.user.token,
      user_id: app.user.user_id,
      class_id: app.user.class_id,
    }).then(res => {
      if (res.response === 'data') {
        this.setData({
          cateList: res.list
        })
      }
    })
  },

  //跳转到评论页面
  goToComment(e) {
    let article_id = e.currentTarget.dataset.articleid
    wx.navigateTo({
      url: '/pages/comment/comment?articleid=' + article_id + '&type=index'
    })
  },

  //点赞
  clickZan(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let is_zan = article[key].is_remard
    if (is_zan == '1') {
      return
    }
    article[key].is_remard = article[key].is_remard === 1 ? 0 : 1
    article[key].like_num = parseInt(article[key].like_num) + 1
    util.wxpromisify({
      url: 'article/like_article',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      this.setData({
        article
      })
    })
  },
  onShareAppMessage() {}
})
