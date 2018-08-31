// pages/publish/publish.js
let util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitAuth: false,
    info: '',
    list: [{
      index: 1,
      active: true,
      label: '通知'
    }, {
      index: 2,
      active: false,
      label: '作业'
    }, {
      index: 3,
      active: false,
      label: '相册'
    }, {
      index: 4,
      active: false,
      label: '光荣榜'
      // }, {
      //   index: 4,
      //   active: false,
      //   label: '接龙'
    }],
    handle: [{
        index: 0,
        type: '顶置',
        on: false
      },
      {
        index: 1,
        type: '允许评论',
        on: false
      },
      {
        index: 2,
        type: '公开',
        on: false
      }
    ],
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
    params: {
      article_type: 1,
      is_top: 0,
      can_comment: 0,
      is_open: 0,
      article_accessory: []
    },
    showPlusIcon: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let role = app.user.user_role
    // if (role === 1) {
    //   this.setData({
    //     submitAuth: false
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您没有发布的权限',
    //     showCancel: false,
    //     success: function () {
    //       wx.switchTab({
    //         url: '/pages/index/index'
    //       })
    //     }
    //   })
    //   this.setData({
    //     submitAuth: true
    //   })
    // }
  },
  switchChange(e) {
    let num = e.currentTarget.dataset.num
    let bool = e.detail.value ? 1 : 0
    let params = this.data.params
    if (num == 0) {
      params.is_top = bool
    } else if (num == 1) {
      params.can_comment = bool
    } else {
      params.is_open = bool
    }
  },
  changeActive(e) {
    let index = e.target.dataset.index
    let data_list = this.data.list.map((val, key, arr) => {
      val.active = val.index == index ? true : false
      return val
    })
    let params = this.data.params
    params.article_type = index
    this.setData({
      params: params,
      list: data_list
    })
  },
  // del(){},
  handleSwitch(event) {
    let index = event.currentTarget.dataset.num
    let arr = this.data.handle
    let curActive = arr[index]['on']
    arr[index]['on'] = curActive ? false : true
    this.setData({
      handle: arr
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
      // itemList: ["从相册中选择"],
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
      success:  (res) => {
       
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
    let index = e.currentTarget.dataset.index
    let evalList = this.data.evalList
    let params = this.data.params
    let img = evalList[0].tempFilePaths
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
    let descript = e.detail.value.descript.trim()
    let params = {
      user_id: app.user.user_id,
      token: app.user.token,
      class_id: app.user.class_id,
      article_content: descript
    }
    if (!descript) {
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
      params.article_accessory = imgArray
      Object.assign(data_params, params)
      util.wxpromisify({
        url: 'article/release',
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
                  url: '../index/index'
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
  init() {
    this.setData({
      evalList: [{
        tempFilePaths: [],
        imgList: []
      }],
      handle: [{
          index: 0,
          type: '顶置',
          on: false
        },
        {
          index: 1,
          type: '允许评论',
          on: false
        },
        {
          index: 2,
          type: '公开',
          on: false
        }
      ],
      info: ''
    })
  }
})
