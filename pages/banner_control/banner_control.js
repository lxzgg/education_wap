// pages/banner_control/banner_control.js
const app = getApp()
let utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSort: 0,
    list: [{
        id: 1,
        src: '/image/banner1.jpg'
      },
      {
        id: 2,
        src: '/image/banner2.jpg'
      },
    ]
  },
  // 开启排序
  setSort(e) {
    this.setData({
      isSort: e.currentTarget.dataset.num
    })
  },
  down(e) {
    let index = e.currentTarget.dataset.index;
    let temp_list = this.data.list;
    let temp_item = temp_list.splice(index, 1)[0]
    temp_list.splice(index + 1, 0, temp_item)
    this.setData({
      list: temp_list
    })
  },
  up(e) {
    let index = e.currentTarget.dataset.index;
    let temp_list = this.data.list;
    let temp_item = temp_list.splice(index, 1)[0]
    temp_list.splice(index - 1 < 0 ? 0 : index - 1, 0, temp_item)
    this.setData({
      list: temp_list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.wxpromisify({
      url: 'class_info/userAd',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        page: 1,
        num: 25
      },
      method: 'post'
    }).then((res) => {
      console.log(res)
      if (res && res.response === 'data') {
        this.setData({
          //  content: res.data
        })
      }
    })
  },
  plusImg() {
    wx.showActionSheet({
      // itemList: ["从相册中选择", "拍照"],
      itemList: ["从相册中选择"],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album", imgNumber)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera", imgNumber)
          }
        }
      }
    })
  },
  chooseWxImage(type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function (res) {
        var addImg = res.tempFilePaths
        var addLen = addImg.length
      },
    })
  },

  //多张图片上传
  upload: function (path) {
    let reponseData = {}
    wx.showToast({
        icon: "loading",
        title: "正在上传"
      }),
      util.wxpromisify({
        url: 'oss/getOssParam',
        data: {
          type: 'image'
        },
        method: 'post'
      }).then((res) => {
        if (res && res.response == 'data') {
          reponseData = res.data
        } else {}
      }).then(() => {
        wx.uploadFile({
          url: 'https://oss.whwhjy.com',
          filePath: path,
          name: 'file',
          // header: {
          //   "Content-Type": "multipart/form-data"
          // },
          formData: {
            name: path,
            key: reponseData.dir + reponseData.expire + "${filename}",
            policy: reponseData.policy,
            OSSAccessKeyId: reponseData.accessid,
            success_action_status: "200",
            signature: reponseData.signature
          },
          success: function (res) {
            if (res && res.statusCode == 200) {}
          },
          fail: function (e) {},
          complete: function (e) {}
        })
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
