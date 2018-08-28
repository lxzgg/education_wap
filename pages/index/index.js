const app = getApp()

Page({
  data: {},


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
    app.api.home.article({...app.user}).then(res => {
      if (res.response === 'data') {
        this.setData({
          article: []
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
