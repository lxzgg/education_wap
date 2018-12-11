const app = getApp()
const util = require('../../../utils/util')
Page({
  data: {
    article: [],
    totalPage: 1,
    pageSize: 10,
    currentPage: 1,
    curIndex: 1
  },
  onLoad: function () {
    this.getArticle()
  },
  //获取我的发布内容列表
  getArticle() {
    util.wxpromisify({
      url: 'article/articleList',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        page: this.data.currentPage,
        num: this.data.pageSize
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let article = this.data.article
        article.push(...res.list)
        this.setData({
          article
        })
      }
    })
  },
  //获取家长圈发布列表内容
  getFirendArticle() {
    util.wxpromisify({
      url: 'friend/contents',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        page: this.data.currentPage,
        num: this.data.pageSize
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        let article = this.data.article
        let list = res.list.map((val, key) => {
         
          // let arr = [],
          //   ids = []
          // if (val.cate_list.length > 0) {
          //   val.cate_list.forEach((vo, k) => {
          //     arr.push(vo.cate_name)
          //     ids.push(vo.cate_id)
          //   })
          // }

          return {
            article_content: val.content,
            article_id: val.id,
            // article_type: arr.toString(),
            // article_type_ids: ids.toString(),
            browser_num: val.browser_num,
            is_open: val.is_open
          }
        })
        article.push(...list)
        this.setData({
          article
        })
      }
    })
  },
  //开启/禁止评论
  switchCommentAuth(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let can_comment = article[key].can_comment //当前评论权限
    article[key].can_comment = article[key].can_comment == '1' ? 0 : 1 //修改后的评论权限
    util.wxpromisify({
      url: 'article/evalStatus',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          article
        })
      }
    })
  },
  //是否置顶
  switchTopAuth(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let is_top = article[key].is_top //当前评论权限
    article[key].is_top = parseInt(article[key].is_top) === 1 ? 0 : 1 //修改后的评论权限
    util.wxpromisify({
      url: 'article/topStatus',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        article_id: articleid
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          article
        })
      }
    })
  },

   //是否公开
  switchOpenAuth(e) {
    const key = e.currentTarget.dataset.index
    const articleid = e.currentTarget.dataset.articleid
    let article = this.data.article
    let is_open = article[key].is_open //当前评论权限
    article[key].is_open = parseInt(article[key].is_open) === 1 ? 0 : 1 //修改后的评论权限
    util.wxpromisify({
      url: 'friend/open_status',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        id: articleid
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        this.setData({
          article
        })
      }else{
        wx.showToast({title: res.error.message,icon:'none',duration:5000})
      }
    })
  },

  //跳转到文章统计页面
  goToCount(e) {
    // if(this.data.curIndex === 2){
    //   return 
    // }
    const articleid = e.currentTarget.dataset.articleid
    const type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type :''
    wx.navigateTo({
      url: '/pages/screen_count/screen_count?articleid=' + articleid + '&type=' + type
    })
  },
  //跳转到编辑页面
  gotToEdit(e) {
    const articleid = e.currentTarget.dataset.articleid
    // app.publish_data = {
    //   articleid: articleid,
    //   handle: 'edit'
    // }
    if (this.data.curIndex === 1) { //我的发布
      wx.navigateTo({
        url: '/pages/public_edit/public_edit?articleid='+articleid
      })
      // app.publish_data.page = 'my_publish'
    } else {
      wx.navigateTo({
        url: '/pages/public_circle/public_circle?articleid='+articleid
      })
    }
  },
  //上拉加载
  onReachBottom: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    let page = this.data.currentPage
    let totalPage = this.data.totalPage
    wx.hideLoading()
    if (page > totalPage) {
      wx.showToast({
        title: '没有更多数据了',
        duration: 3000,
        icon: 'none'
      })
    } else {
      this.setData({
        currentPage: page + 1
      })
      if (this.data.curIndex == '1') {
        this.getArticle()
      } else {
        this.getFirendArticle()
      }
    }
  },
  //切换btn
  switchReadStatus(e) {
    let curIndex = e.currentTarget.dataset.index
    curIndex = parseInt(curIndex)
    this.setData({
      curIndex,
      currentPage: 1,
      article: []
    })
    if (curIndex == '1') {
      this.getArticle()
    } else {
      this.getFirendArticle()
    }

  }
})
