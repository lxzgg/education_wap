const app = getApp()

Page({
  data: {
    isEmpty: true
  },


  onLoad() {
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
    app.api.home.adList({...app.user}).then(res => {
      this.setData({adList: res.list})
    })
  },

  // 获取文章列表
  getArticle() {
    app.api.home.article({ page:1,
      token: app.user.token,
      num: 10,
      user_id: app.user.user_id,
      class_id: app.user.class_id}).then(res => {
      if (res.response === 'data') {
        this.setData({
          article: res.list
        })
      }
    })
  },

  // 首页分类列表
  cateList() {
    app.api.home.cateList({...app.user}).then(res => {
      if (res.response === 'data') {
        this.setData({
          cateList: []
        })
      }
    })
  }
})
