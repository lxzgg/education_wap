// pages/myself/class_infomation/class_infomation.js
const app = getApp()
let utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    content: {},
    qrcode:'',
    index: 0,
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
    admin_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.wxpromisify({
      url: 'class_info/info',
      data: app.user,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        this.setData({
          content: res.data
        })
      }
    })
    this.getTeacherList()
    this.createqrCode()
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
  goToBannerContr() {
    wx.navigateTo({
      url: '/pages/banner_control/banner_control'
    })
  },
  uploadImg() {
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
        let content = this.data.content
        let addImg = res.tempFilePaths
        let addLen = addImg.length;
        content.class_image = addImg[0]
        evalList[0].tempFilePaths.push({
          type: 'classLogo',
          path: addImg[0]
        })
        this.setData({
          evalList: evalList,
          content
        })
        this.getOssParams(addImg[0], 'classLogo')
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
  getTeacherList() {
    let url = app.user.admin_type == '1' ? 'user/teaTelBook' : 'user/userTelBook'
    utils.wxpromisify({
      url: url,
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        this.setData({
          admin_list: res.list
        })
      } else {
        this.setData({
          admin_list: []
        })
      }
    })
  },
  bindPickerChange(e) {
    let index = e.detail.value
    let admin_list = this.data.admin_list
    let content = this.data.content
    content.admin_id = admin_list[index].user_id
    content.username = admin_list[index].username
    this.setData({
      index,
      content
    })
  },

  formSubmit(e) {
    let admin_id = ''
    if (this.data.admin_list.length > 0) {
      admin_id = this.data.admin_list[this.data.index].user_id
    } else {
      admin_id = this.data.content.admin_id
    }
    let image = this.data.evalList[0].imgList[0]
    let class_image = ''
    if (image) {
      let keys = image.path.indexOf('tmp')
      let str = image.path.slice(keys)
      class_image = image.expire + str
    } else {
      class_image = this.data.content.class_image
    }
    let member_num = e.detail.value.member_num
    let class_name = e.detail.value.class_name
    if (!class_image) {
      wx.showToast({
        title: '请上传班级图片',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (!class_name) {
      wx.showToast({
        title: '请填写班级名称',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (!member_num) {
      wx.showToast({
        title: '请填写班级成员总数',
        icon: 'none',
        duration: 3000
      })
      return
    }
    let params = {
      user_id: app.user.user_id,
      token: app.user.token,
      class_id: app.user.class_id,
      class_name,
      member_num,
      admin_id,
      class_image
    }
    wx.showToast({
      icon: "loading",
      title: "正在提交"
    })
    utils.wxpromisify({
      url: 'class_info/editClass',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success: (res) => {
            this.onLoad()
          }
        })

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
        showCancel: false,
        success: () => {

        }
      })
    })
  },
  //生成二维码
    createqrCode(){
    utils.wxpromisify({
      url: 'index/qrcode',
      data: {
        param: {
          class_id: app.user.class_id
        },
        page: 'pages/myself/join_class/join_class'
      },
      method: "post"
    }).then(res => {
      if(res && res.response === 'data'){
        let qrcode = res.data.qrcode
        this.setData({
           qrcode
        })
      }
    })
  },
   //保存图片
  savePhotos() {
    let qrcode = this.data.qrcode
    wx.getImageInfo({
      src: qrcode,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
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
      }
    })
  }
})
