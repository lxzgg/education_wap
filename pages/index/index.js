const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    isEmpty: true,
    showModal:true, //显示授权modal
    totalPage: 1,
    pageSize: 10,
    currentPage: 1,
    adList: [{
      ad_image: '../../image/banner1.jpg'
    }],
    cateList: [],
    article: []
  },
  onLoad(options) {
    let class_id = app.user.class_id
    if (!class_id || class_id == '0' || (options && options.type == "index") || (options && options.type == "firend")) {
      new Promise((resolve) => {
        wx.login({
          success: res => {
            resolve(res)
          }
        })
      }).then(res => {
        const code = res.code
        return app.api.loginStatus({
          code
        })
      }).then(res => {
        // 用户信息全局保存
        app.user = res.data
        wx.setStorage({
          key: 'user',
          data: res.data
        })
        wx.hideLoading()
        this.init()
        if (options && options.type == "index") {
          if (options.is_platform && options.is_platform == '1') {
            wx.navigateTo({
              url: '/pages/article_details/article_details?articleid=' + options.articleid + '&type=index',
            })
          } else {
            wx.navigateTo({
              url: '/pages/comment/comment?articleid=' + options.articleid + '&type=index',
            })
          }

        }
        if (options && options.type == "firend") {
          wx.navigateTo({
            url: '/pages/comment/comment?articleid=' + options.articleid + '&type=firend',
          })
        }
      }).catch(() => {

      })
    }
    this.init()
  },
  onShow(){
    this.isAuthStatus()
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
  isAuthStatus(){
    if(app.user.auth_status){
      this.setData({showModal: false})
    }
  },


  // 获取文章列表
  getArticle() {
    util.wxpromisify({
      url: 'index/indexArticle',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method: 'post'
    }).then(res => {
      if (res.response === 'data') {
        let article = this.data.article
        // article.push(...res.list)
        this.setData({
          article: res.list,
          isEmpty: false,
          totalPage: res.total_page
        })
      }
    })

    // app.api.home.article({
    //   page: this.data.currentPage,
    //   token: app.user.token,
    //   num: this.data.pageSize,
    //   user_id: app.user.user_id,
    //   class_id: app.user.class_id,
    //   article_type: ''
    // }).then(res => {

    // })
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
    let platform = e.currentTarget.dataset.platform
    let article_id = e.currentTarget.dataset.articleid
    if (platform == '1') {
      wx.navigateTo({
        url: '/pages/article_details/article_details?articleid=' + article_id + '&type=index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/comment/comment?articleid=' + article_id + '&type=index'
      })
    }
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
  onShareAppMessage(e) {
    let articleid = e.target.dataset.articleid
    let type = e.target.dataset.type
    let platform = e.target.dataset.platform

    return {
      title: '给你分享一个' + type + '内容',
      imageUrl: '/image/xiaohaoge.png',
      path: '/pages/index/index?articleid=' + articleid + '&type=index' + '&is_platform=' + platform // 路径，传递参数到指定页面。
    }
  },

  //下拉刷新数据
  onPullDownRefresh(e) {
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    })
    this.setData({
      article: []
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
  },
  //接收从model传回来的值
  getResultFromComp(e){
    let result = e.detail.ret
   if(result === 'ok'){
     this.setData({
       showModal: false
     })
   }
  }
})
