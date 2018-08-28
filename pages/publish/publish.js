// pages/publish/publish.js
let util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
              console.log(4)
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
    let descript = e.detail.value.descript.trim()
    let params = {
      user_id: wx.getStorageSync('userInfo').user_id,
      token: wx.getStorageSync('userInfo').token,
      class_id: wx.getStorageSync('class_id'),
      article_content: descript
    }
    let imgUrl = this.data.evalList,
      data_params = this.data.params,
      imgArray = []
    imgUrl[0].tempFilePaths.forEach((val, key) => {
      let obj = {
        'image': val
      }
      imgArray.push(obj)
    })
    params.article_accessory = imgArray
    if (!descript) {
      wx.showToast({
        title: '请输入文字描述',
        icon: 'none',
        duration: 5000
      })
      return
    }

    // 先上传图片
    this.upload(imgUrl[0].tempFilePaths)

    Object.assign(data_params, params);

    //form submit
    util.wxpromisify({
      url: 'index/release',
      data: data_params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000,
          success: function (res) {
            wx.switchTab({
              url: '../index/index',
              success: function (res) {
                // success
              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })

          },
        })
      }
    }).catch((err) => {

    })
  }
})
