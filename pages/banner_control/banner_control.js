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
    this.getBannerImg()
  },
  getBannerImg() {
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
      if (res && res.response === 'data') {
        console.log(res)
        this.setData({
           list: res.list
        })
      }
    })
  },
  plusImg() {
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success:  (res)=>{
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseWxImage("album")
          } else if (res.tapIndex == 1) {
            this.chooseWxImage("camera")
          }
        }
      }
    })
  },
  chooseWxImage(type) {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: (res) => {
        console.log(res)
        var addImg = res.tempFilePaths
        var addLen = addImg.length
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        this.upload(addImg[0])
      }
    })
  },

  //多张图片上传
  upload: function (path) {
    let reponseData = {}
    utils.wxpromisify({
      url: 'oss/getOssParam',
      data: {
        type: 'adImage'
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
    }).then(() => {
      //上传图片到后台
         let keys = path.indexOf('tmp')
       let filename = reponseData.expire+path.slice(keys)
      utils.wxpromisify({
        url: 'class_info/ad_upload',
        data: {
          user_id: app.user.user_id,
          token: app.user.token,
          filename: filename
        },
        method: 'post'
      }).then((res) => {
        this.getBannerImg()
      })
    })
  }
})
