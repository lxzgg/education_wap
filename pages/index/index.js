const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    isEmpty: true,
    totalPage: 1,
    pageSize: 10,
    currentPage: 1,
    adList: [{
      ad_image: '../../image/banner1.jpg'
    }],
    cateList:[],
    article: []
  },
  onLoad(options) {
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
      if (res && res.response === 'data') {
        this.setData({
          adList: []
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
      page: this.data.currentPage,
      token: app.user.token,
      num: this.data.pageSize,
      user_id: app.user.user_id,
      class_id: app.user.class_id,
      article_type: ''
    }).then(res => {
      if (res.response === 'data') {
        let article = this.data.article
        article.push(...res.list)

        this.setData({
          article,
          isEmpty: false,
          totalPage: res.total_page
        })
      }
    })
  },
  // 首页分类列表
  cateList() {
    app.api.home.cateList({
      token: app.user.token,
      user_id: app.user.user_id,
      class_id: app.user.class_id
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

  //跳转到浏览统计页面
  goToScreenCount(e) {
    let article_id = e.currentTarget.dataset.articleid
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/screen_count/screen_count?articleid=' + article_id + '&type=' + type
    })
  },

  //点赞
  clickZan(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let is_zan = article[key].is_remard
    article[key].is_remard = article[key].is_remard == '1' ? 0 : 1
    article[key].like_num = article[key].is_remard == '1' ? parseInt(article[key].like_num) + 1 : parseInt(article[key].like_num) - 1

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
  onShareAppMessage() {
    return {
      title: '分享首页内容',
      imageUrl: '/image/xiaohaoge.png',
      path: 'pages/index/index' // 路径，传递参数到指定页面。
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
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
  //下拉刷新数据
  onPullDownRefresh(e) {
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    })
    this.init();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000)
  },
  //格式化参数
  format(string) {
    let params = []
    if (string) {
      if (string.indexOf('&')) {
        let arr = string.split('&')
        for (let i = 0, l = arr.length; i < l; i++) {
          let a = arr[i].split("=");
          params[a[0]] = a[1];
        }
        return params;
      } else {
        let b = string.split('=')
        params[b[0]] = b[1]
      }
    }
    return params
  }
})
