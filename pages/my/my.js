// pages/my/my.js
let utils = require('../../utils/util')
const app = getApp()
Page({
  data: {
    imageUrl: '',
    nickname: '',
    showModalStatus: false,
    roleName: '',
    loginAuth: 0,
    isAdmin:false,
    erCodeImg: '/image/user.png',
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
  },
  onLoad: function (options) {
    //非管理员 权限限制
    let isAdmin = app.user.is_admin == '1' ? true : false
    this.setData({
      isAdmin
    })
    this.getUserSelfInfo()
  },
  //页面跳转到用户基本信息
  goToPersonInfo() {
    wx.reLaunch({
      url: '/pages/personData/personData'
    })
  },
  //页面
  getUserInfo() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: false,
            success: (data) => {
              const userInfo_string = data.rawData
              const userInfo = JSON.parse(userInfo_string)
              utils.wxpromisify({
                url: "user/updateUserInfo",
                data: {
                  user_id: app.user.user_id,
                  token: app.user.token,
                  city: userInfo.province,
                  nickname: userInfo.nickName,
                  gender: userInfo.gender,
                  language: userInfo.language,
                  avatarUrl: userInfo.avatarUrl
                },
                method: 'post'
              }).then((res) => {
                if (res && res.response === 'data') {
                  // Object.assign(app.user, {islogin:1})
                  // wx.setStorageSync('user', Object.assign(wx.getStorageSync('user'), {islogin:1}))
                  this.getUserSelfInfo()
                }

              })
            },
            fail: (err) => {}
          })
        }
      }
    })
  },
  getUserSelfInfo() {
    let is_admin = ''
    if (app.user.is_admin != '1') {
      is_admin = app.admin_auth[app.user.is_admin] + '/' + app.user_role[app.user.user_role]
    } else {
      is_admin = app.admin_auth[app.user.is_admin]
    }
    this.setData({
      roleName: is_admin
    })
    utils.wxpromisify({
      url: 'user/userInfo',
      data: app.user,
      method: 'post'
    }).then((ret) => {
      if (ret.response == 'data') {
        this.setData({
          nickname: ret.data.nickname,
          imageUrl: ret.data.avatarUrl,
          // loginAuth: app.user.islogin
        })
      }
    }).catch((err) => {})
  },
  //显示对话框
  showModal: function () {
    // utils.wxpromisify({
    //   url: 'index/qrcode',
    //   data: {
    //     param: {
    //       class_id: app.user.class_id
    //     },
    //     page: 'pages/index/index'

    //   },
    //   method: "post"

    // }).then(res => {})
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

  //保存图片
  savePhotos() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.erCodeImg,
      success: (res) => {
        this.setData({
          showModalStatus: false
        })
      }
    })
  },
  switchHeadImg() {
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
    let evalList = this.data.evalList
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: (res) => {
        let imageUrl = this.data.imageUrl
        let addImg = res.tempFilePaths
        let addLen = addImg.length;
        imageUrl = addImg[0]
        evalList[0].tempFilePaths.push({
          type: 'head_image',
          path: addImg[0]
        })
        this.setData({
          evalList: evalList,
          imageUrl
        })
        this.getOssParams(addImg[0], 'head_image').then(()=>{
             this.submitImg()
        })
      }
    })
  },
  getOssParams(path, type) {
    return Promise.resolve().then(res => {
      return utils.wxpromisify({
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
        obj.expire = reponseData.expire
        obj.type = type
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

  submitImg() {
    let image = this.data.evalList[0].imgList[0]
    let image_src = ''
    let keys = image.path.indexOf('tmp')
    let str = image.path.slice(keys)
    image_src = image.expire + str
    utils.wxpromisify({
      url: 'user/head_image',
      data: {
        user_id: app.user.user_id,
        token: app.user.token,
        image_src
      },
      method: "post"
    }).then(res => {
      this.getUserSelfInfo()
    })
  }
})
