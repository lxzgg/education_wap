// pages/publish/publish.js
let util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitAuth: false,
    navData: [],
    switch: true,
    current_id: 2,
    info: '',
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
    params: {
      article_type: 1,
      is_open: 0,
      // article_accessory: []
    },
    showPlusIcon: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.wxpromisify({
      data: {},
      url: 'friend/getCateList',
      method: 'post'
    }).then(res => {
      const navData = res.list
      this.setData({
        navData
      })
    })
  },
  switchChange(e) {
    let switchs = e.detail.value
    this.setData({
      switch: switchs
    })
  },
  changeActive(e) {
    let current_id = e.target.dataset.index
    this.setData({
      current_id
    })
  },

  //添加图片
  joinPicture: function (e) {
    var evalList = this.data.evalList;
    var that = this;
    var imgNumber = evalList[0].tempFilePaths.length
    if (imgNumber >= 3) {
      wx.showModal({
        title: '',
        content: '最多上传三张图片',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
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
  chooseWxImage(type, num) {
    var evalList = this.data.evalList
    let showPlusIcon = true
    let curImgLen = evalList[0].tempFilePaths.length
    var img = []
    if (curImgLen > 0) {
      img = evalList[0].tempFilePaths.map((val, key) => {
        return val
      })
    }
    var that = this;
    let maxCount = 3 - num
    wx.chooseImage({
      count: maxCount,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: (res) => {
        var addImg = res.tempFilePaths
        var addLen = addImg.length;
        for (var i = 0; i < addLen; i++) {
          img.push(addImg[i])
        }
        evalList[0].tempFilePaths = img
        if (img.length >= 3) {
          showPlusIcon = false
        }
        that.setData({
          evalList: evalList,
          showPlusIcon: showPlusIcon
        })
         for (let i = 0; i < img.length; i++) {
        this.getOssParams(img[i])
      }
      }
    })
  },
  //删除图片
  clearImg(e) {
    var index = e.currentTarget.dataset.index
    var evalList = this.data.evalList
    var params = this.data.params
    var img = evalList[0].tempFilePaths
    let showPlusIcon = this.data.showPlusIcon
    img.splice(index, 1)
    if (img.length < 3) {
      showPlusIcon = true
    }
    this.setData({
      evalList: evalList,
      showPlusIcon: showPlusIcon
    })
  },
  
  getOssParams(path) {
    return Promise.resolve().then(res => {
      return util.wxpromisify({
        url: 'oss/getOssParam',
        data: {
          type: 'image'
        },
        method: 'post'
      })
    }).then((res) => {
      if (res && res.response == 'data') {
        let reponseData = res.data
        let evalList = this.data.evalList
        let obj = {}
        obj.expire = reponseData.expire
        obj.path = path
        evalList[0].imgList.push(obj)
        this.setData({
          evalList
        })
        return this.uploadImage(reponseData, path)
      }
    })
  },

  uploadImage(reponseData, path) {
    return new Promise(resolve => {
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
        success: (res) => {
          resolve()
        },
        fail: function (e) {},
        complete: function (e) {}
      })
    })
  },

  formSubmit(e) {
    let content = e.detail.value.descript.trim()
     let is_open = this.data.switch ? 1 : 0
    let params = {
      user_id: app.user.user_id,
      token: app.user.token,
      is_open,
      content,
      cate_ids: this.data.current_id
    }
    if (!content) {
      wx.showToast({
        title: '请输入文字描述',
        icon: 'none',
        duration: 5000
      })
      return
    }
    wx.showToast({
      icon: "loading",
      title: "正在提交"
    })
      let imgList = this.data.evalList[0]['imgList']
      let data_params = this.data.params,
        imgArray = []
      imgList.forEach((val, key) => {
         let keys = val.path.indexOf('tmp')
        let str = val.path.slice(keys)
        let obj = {
          'image': val.expire+str
        }
        imgArray.push(obj)
      })
      params.accessory = imgArray
      Object.assign(data_params, params)
      util.wxpromisify({
        url: 'friend/addContent',
        data: data_params,
        method: 'post'
      }).then((res) => {
        if (res && res.response === 'data') {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/publish_index/publish_index'
                })
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none',
            duration: 5000
          })
        }
      })
  },
})
