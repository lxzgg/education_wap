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
      on: true
    },
      {
        index: 1,
        type: '允许评论',
        on: true
      },
      {
        index: 2,
        type: '公开',
        on: true
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
      is_open: 0
    }
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
  switch1Change(e) {
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
    console.log(params)
    // console.log(e)
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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
    console.log(params)
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
    // var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList
    // console.log(evalList)
    var that = this
    // var imgNumber = evalList[index].tempFilePaths;
    // if (imgNumber.length >= 3) {
    //   wx.showModal({
    //     title: '',
    //     content: '最多上传三张图片',
    //     showCancel: false,
    //   })
    //   return;
    // }
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: '#f7982a',
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage(type) {
    var evalList = this.data.evalList
    var curImgLen = evalList[0].tempFilePaths.length
    var img = []
    if (curImgLen > 0) {
      img = evalList[0].tempFilePaths.map((val, key) => {
        return val
      })
    }
    // var len = img.length;
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // console.log(res)
        var addImg = res.tempFilePaths
        // console.log('res:'+ res.tempFilePaths)
        var addLen = addImg.length
        // if (addLen > 3) {
        for (var i = 0; i < addLen; i++) {
          // console.log(addImg[i])
          img.push(addImg[i])
        }
        // } else {
        //   for (var j = 0; j < addLen; j++) {
        //     img.push(addImg[j]);
        //   }
        // // }
        // console.log(img)
        evalList[0].tempFilePaths = img
        that.setData({
          evalList: evalList
        })
        that.upLoadImg(img)
      }
    })
  },
  upLoadImg: function (list) {
    var that = this
    this.upload(that, list)
  },
  //多张图片上传
  upload: function (page, path) {
    var that = this
    var curImgList = [],
      reponseData = []
    console.log(path)

    for (let i = 0; i < path.length; i++) {
      wx.showToast({
        icon: 'loading',
        title: '正在上传'
      }),
        console.log(0)
      util.wxpromisify({
        url: 'oss/getOssParam',
        data: {
          type: 'image'
        },
        method: 'post'
      }).then((res) => {
        console.log(res)
        console.log('--------------------------------')
        if (res && res.response == 'data') {
          reponseData = res.data
        } else {
          console.log(res.response)
        }
      }).then(() => {

        console.log(2)
        wx.uploadFile({
          url: 'https://oss.whwhjy.com',
          filePath: path[i],
          name: 'file',
          // header: {
          //   "Content-Type": "multipart/form-data"
          // },
          formData: {
            name: path[i],
            key: reponseData.dir + reponseData.expire + '${filename}',
            policy: reponseData.policy,
            OSSAccessKeyId: reponseData.accessid,
            success_action_status: '200',
            signature: reponseData.signature
          },
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: JSON.stringify(res),
              showCancel: false
            })

            console.log(3)
            console.log(res)
            // curImgList.push(res.data);
            // var evalList = that.data.evalList;
            // evalList[0].imgList = curImgList;
            // that.setData({
            //   evalList: evalList
            // })
            // if (res.statusCode != 200) {
            //   wx.showModal({
            //     title: '提示',
            //     content: '上传失败',
            //     showCancel: false
            //   })
            //   return;
            // } else {
            wx.showModal({
              title: '提示',
              content: '上传成功',
              showCancel: false
            })
            //   return;
            // }
            // // var data = res.data
            // // page.setData({  //上传成功修改显示头像
            // //   src: path[0]
            // // })
          },
          fail: function (e) {
            console.log(e)

            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function (e) {
            wx.showModal({
              title: '提示',
              content: JSON.stringify(e),
              showCancel: false
            })
            // wx.hideToast(); //隐藏Toast
          }
        })

      })
    }


    return


  },
  //删除图片
  clearImg(e) {
    var index = e.currentTarget.dataset.index
    // console.log(index)
    var evalList = this.data.evalList
    var img = evalList[0].tempFilePaths
    img.splice(index, 1)
    this.setData({
      evalList: evalList
    })
    // this.upLoadImg(img);
  },
  //提交发布
  submitClick: function (e) {
    var evalList = that.data.evalList
    var imgList = evalList[0].imgList
    var imgPort = '' //图片地址，多张以逗号分割
    if (imgList.length != 0) {
      for (var j = 0; j < imgList.length; j++) {
        imgPort = imgList[j] + ',' + imgPort
      }
    } else {
      imgPort = ''
    }
  },
  formSubmit(e) {
    let descript = e.detail.value.descript.trim()
    if (!descript) {
      wx.showToast({
        title: '请输入文字描述',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let params = {
      user_id: wx.getStorageInfoSync('userInfo').user_id,
      token: wx.getStorageInfoSync('userInfo').user_id,
      class_id: '',
      article_content: '',
      article_accessory: '',
      article_type: '',
      is_top: '',
      can_comment: '',
      is_open: ''
    }
  }
})
