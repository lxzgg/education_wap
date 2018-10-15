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
    isAdmin: false,
    windowWidth: 240,
    windowHeight: 300,
    qrcode: '',
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
  },
  onHide() {
    this.setData({
      showModalStatus: false
    })
  },
  onShow: function (options) {
    //非管理员 权限限制
    let isAdmin = app.user.is_admin == '1' ? true : false
    this.setData({
      isAdmin
    })
    this.getUserSelfInfo()
    //生成二维码
    this.createqrCode()
    //查找当前班级
    this.getCurrentClasss()
  },

  //页面跳转到用户基本信息
  goToPersonInfo() {
    wx.navigateTo({
      url: '/pages/personData/personData'
    })
  },
  //页面
  getUserInfo() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: (data) => {
              new Promise((resolve, reject) => {
                utils.wxpromisify({
                  url: "user/login",
                  data: {
                    code: res.code,
                    encryptedData: data.encryptedData,
                    iv: data.iv
                  },
                  method: 'post'
                }).then((ret) => {
                  Object.assign(app.user, ret.data)
                  wx.setStorageSync('user', ret.data)
                  let unionid = ret.data.unionid
                  const userInfo_string = data.rawData
                  const userInfo = JSON.parse(userInfo_string)
                  utils.wxpromisify({
                    url: "user/updateUserInfo",
                    data: {
                      unionid: unionid,
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
                })
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
      data: {
        user_id: app.user.user_id,
        token: app.user.token
      },
      method: 'post'
    }).then((ret) => {
      if (ret.response == 'data') {
        app.username = ret.data.username
        // Object.assign(app.user, app.user.username)
        this.setData({
          nickname: ret.data.nickname,
          imageUrl: ret.data.avatarUrl
          // loginAuth: app.user.islogin
        })
      }
    }).catch((err) => {})
  },
  getCurrentClasss() {
    utils.wxpromisify({
      url: 'class_info/info',
      data: app.user,
      method: 'post'
    }).then((res) => {
      app.class_name = res.data.class_name
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
    setTimeout(() => {
      const username = app.username ? app.username : ''
      const class_name = app.class_name
      // console.log(this.data.qrcode)
      wx.getImageInfo({
        src: this.data.qrcode,
        success: (res) => {
          this.drawImg(username, class_name, res.path)
        }
      })

      this.setData({
        animationData: animation.export()
      })
    }, 200)
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
  createqrCode() {
    utils.wxpromisify({
      url: 'index/qrcode',
      data: {
        param: {
          class_id: app.user.class_id
        },
        page: 'pages/index/index'
      },
      method: "post"
    }).then(res => {
      if (res && res.response === 'data') {
        let qrcode = res.data.qrcode
        this.setData({
          qrcode
        })
      }
    })
  },

  //保存图片
  savePhotos() {
    wx.showModal({
      title: '提示',
      content: '保存该图片，可以分享给其他老师或者家长',
      success: (res) => {
        if (res.confirm) {
          let qrcode = this.data.qrcode
          wx.saveImageToPhotosAlbum({
            filePath: qrcode,
            success: (res) => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 3000
              })
              setTimeout(() => {
                this.setData({
                  showModalStatus: false
                })
              }, 3000)
            },
            fail: (err) => {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: '已取消',
            icon: 'none'
          })
        }
      },
      complete: () => {
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
        this.getOssParams(addImg[0], 'head_image').then(() => {
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
  },

  drawImg(name, class_name, tempPath) {
    const ctx = wx.createCanvasContext('qrcodeImg')
    // var imgPath = '/image/index.png'; //二维码


    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, this.data.windowWidth, this.data.windowHeight) //填充一个矩形

    ctx.setFillStyle('black')
    ctx.setFontSize(14)
    const title = name + '邀请您使用平安学园创建班级'
    ctx.fillText(title, (this.data.windowWidth - ctx.measureText(title).width) / 2, 30)

    // ctx.setFillStyle('#fff')
    ctx.drawImage(tempPath, 45, 50, 150, 145); //显示图片 (img,sx,sy,swidth,sheight,x,y,width,height)
    ctx.setFontSize(12)
    ctx.setFillStyle('#666')
    ctx.fillText('长按图片识别二维码', (this.data.windowWidth - ctx.measureText('长按图片识别二维码').width) / 2, 210)

    ctx.setFillStyle('#222')
    ctx.setFontSize(12)
    ctx.fillText('步骤如下：', 10, 235)

    ctx.setFillStyle('#333')
    ctx.setFontSize(11)
    ctx.fillText('创建班级--邀请家长/老师--发布/家长圈发布', 10, 258)

    ctx.draw(false, setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        destWidth: this.data.windowWidth,
        destHeight: this.data.windowHeight,
        canvasId: 'qrcodeImg',
        success: (res) => {
          this.setData({
            // shareImg: res.tempFilePath,
            qrcode: res.tempFilePath
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '生成失败',
            icon: "none"
          })
        }
      })
    }, 200));
  }
})
