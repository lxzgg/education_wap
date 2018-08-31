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
      article_accessory: []
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
      success: function (res) {
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
      },
    })
  },

  //多张图片上传
  upload: function (path) {
    var that = this;
    var curImgList = [],
      reponseData = []
    for (let i = 0; i < path.length; i++) {
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
            filePath: path[i],
            name: 'file',
            // header: {
            //   "Content-Type": "multipart/form-data"
            // },
            formData: {
              name: path[i],
              key: reponseData.dir + reponseData.expire + "${filename}",
              policy: reponseData.policy,
              OSSAccessKeyId: reponseData.accessid,
              success_action_status: "200",
              signature: reponseData.signature
            },
            success: function (res) {
              if (res && res.statusCode == 200) {}
            },
            fail: function (e) {
              console.log('fail')
              console.log(e)
            },
            complete: function (e) {
              console.log(e)
            }
          })
        })
    }
  },
  //删除图片
  clearImg(e) {
    var index = e.currentTarget.dataset.index
    var evalList = this.data.evalList
    var params = this.data.params
    var img = evalList[0].tempFilePaths
    let showPlusIcon = this.data.showPlusIcon

    // var img_path = params.article_accessory
    img.splice(index, 1)
    if (img.length < 3) {
      showPlusIcon = true
    }
    // img_path.splice(index, 1);
    this.setData({
      evalList: evalList,
      showPlusIcon: showPlusIcon
      //  params: params
    })
    // this.upLoadImg(img);
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
    let imgUrl = this.data.evalList,
      imgArray = []
    imgUrl[0].tempFilePaths.forEach((val, key) => {
      let obj = {
        'image': val
      }
      imgArray.push(obj)
    })
    params.accessory = imgArray
    if (!content) {
      wx.showToast({
        title: '请输入文字描述',
        icon: 'none',
        duration: 5000
      })
      return
    }
    console.log(JSON.stringify(params))
    // 先上传图片
    this.upload(imgUrl[0].tempFilePaths)
    //form submit
    util.wxpromisify({
      url: 'friend/addContent',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 3000,
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/publish_index/publish_index'
          })
        }, 3000)
      } else {
        wx.showToast({
          title: '发布失败',
          icon: 'fail',
          duration: 5000
        })
      }
    }).catch((err) => {

    })
  }
})
