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
    current_id: 1,
    info: '',
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
    showPlusIcon: true,
    showModalStatus: false
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
      navData.splice(0, 1)
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
          img.push({
            type: 'image',
            path: addImg[i]
          })
        }
        evalList[0].tempFilePaths = img
        if (img.length >= 3) {
          showPlusIcon = false
        }
        that.setData({
          evalList: evalList,
          showPlusIcon: showPlusIcon
        })
        for (let i = 0; i < addImg.length; i++) {
          this.getOssParams(addImg[i], 'image')
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

  getOssParams(path, type) {
    return Promise.resolve().then(res => {
      return util.wxpromisify({
        url: 'oss/getOssParam',
        data: {
          type: type
        },
        method: 'post'
      })
    }).then((res) => {
      if (res && res.response == 'data') {
        let reponseData = res.data
        let evalList = this.data.evalList
        let obj = {}
        obj.type = type
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
    let imgArray = []
    imgList.forEach((val, key) => {
      let keys = val.path.indexOf('tmp')
      let str = val.path.slice(keys)
      let obj = {
        [val.type]: val.expire + str
      }
      imgArray.push(obj)
    })
    params.accessory = imgArray
    util.wxpromisify({
      url: 'friend/addContent',
      data: params,
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
                url: '/pages/publish_index/publish_index',
                success: () => {
                  let page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
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
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).top()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    // animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  openModal() {
    this.setData({
      showModalStatus: true
    })
  },
  chooseType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      showModalStatus: false
    })
    if (type === 'camera') {
      this.joinPicture()
    } else {
      this.joinVideo()
    }
  },
  joinVideo(e) {
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: (res) => {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseVideo("album")
          } else if (res.tapIndex == 1) {
            this.chooseVideo("camera")
          }
        }
      }
    })
  },
  chooseVideo(type) {
    var evalList = this.data.evalList
    wx.chooseVideo({
      sourceType: [type],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
        let evalList = this.data.evalList
        evalList[0].tempFilePaths.push({
          type: 'video',
          path: res.tempFilePath
        })
        let showPlusIcon = evalList[0].tempFilePaths.length >= 3 ? false : true
        this.setData({
          evalList,
          showPlusIcon
        })
        this.getOssParams(res.tempFilePath, 'video')
      },
      fail: (res) => {}
    })
  }
})
