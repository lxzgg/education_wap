// pages/banner_control/banner_control.js
const app = getApp()
let utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSort: 0,
    list: []
  },
  // 开启排序
  setSort(e) {
    let num = e.currentTarget.dataset.num
    if (num == '0') { //完成
      let lists = this.data.list
      let arr = [],
        sort = []
      lists.forEach((val, key) => {
        arr.push(val.cate_id)
        sort.push(key + 1)
      })
      let params = {
        ad_list: arr.toString(),
        sort_list: sort.toString()
      }
      this.submitScort(params)
    }
    this.setData({
      isSort: num
    })
  },
  //开启删除
  openDel(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.list[index].id
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          utils.wxpromisify({
            url: 'class_info/delAd',
            data: {
              user_id: app.user.user_id,
              token: app.user.token,
              id: id
            },
            method: 'post'
          }).then(res => {
            if (res && res.response === 'data') {
              this.data.list.splice(index, 1)
              this.setData({
                list: this.data.list
              })
            }
          })
        }
      },
      fail: (res) => {}
    })
  },
  submitScort(params) {
    utils.wxpromisify({
      url: 'class_info/adSort',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        ...params
      },
      method: 'post'
    }).then(res => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      wx.showModal({
        title: '提示',
        content: '请求超时',
        showCancel: false
      })
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
      success: (res) => {
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
      let filename = reponseData.expire + path.slice(keys)
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
