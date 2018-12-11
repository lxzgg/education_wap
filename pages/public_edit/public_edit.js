let util = require('../../utils/util')
const app = getApp()
Page({
  data: {
    showModalStatus: false,
    homeworkAuth: false, //发布
    is_parent: true, //是否为家长
    info: '', //编辑内容
    hwt_id: '', //作业类型
    cate_id: '',
    list: [],
    handleStatus: true,
    handle: [{
        index: 0,
        type: '顶置',
        on: false
      },
      {
        index: 1,
        type: '允许评论',
        on: true
      }
      // {
      //   index: 2,
      //   type: '公开',
      //   on: false
      // }
    ],
    homeworkType: [{
      id: '12',
      subject: '数学'
    }, {
      id: '13',
      subject: '语文'
    }],
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
    params: {
      article_type: 1,
      is_top: 0,
      can_comment: 1,
      is_open: 0,
      //  hwt_id: '', 作业科目类型
      article_accessory: []
    },
    showPlusIcon: true,
    showDeleteBtn: false,
    options: {}
  },
  onLoad: function (options) {
    this.cateList()
    this.setData({
      options
    })
    this.getContent(this.data.options.articleid)
    let publish_data = app.publish_data
  },
  onShow() {

  },

  getContent(articleid) {
    util.wxpromisify({
      url: 'article/article_detail',
      data: {
        article_id: articleid,
        user_id: app.user.user_id,
        token: app.user.token
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        const responseData = res.data
        let handle = this.data.handle
        let params = this.data.params
        //置顶
        handle[0].on = responseData.is_top == '1' ? true : false
        params.is_top = responseData.is_top
        //评论
        handle[1].on = responseData.can_comment == '1' ? true : false
        params.can_comment = responseData.can_comment
        // //公开
        // handle[2].on = responseData.is_open == '1' ? true : false
        // params.is_open = responseData.is_open

        //类型
        let cate_id = parseInt(responseData.article_type)
        params.article_type = cate_id
        let info = responseData.article_content

        //页面展示图片
        let evalList = this.data.evalList,
          img = []
        if (responseData.article_accessory && responseData.article_accessory.length > 0) {
          img = responseData.article_accessory.map((val, key) => {
            let type = Object.keys(val)[0]
            return {
              type: type,
              path: val[type],
              time: 'old'
            }
          })
        }
        Object.assign(evalList[0].tempFilePaths, img)
        let len = evalList[0].tempFilePaths.length
        let showPlusIcon = len > 2 ? false : true
        this.setData({
          params,
          info,
          handle,
          evalList,
          cate_id,
          showDeleteBtn: true,
          showPlusIcon
        })
      }
    })
  },
  delArticle() {
    util.wxpromisify({
      url: 'article/del_article',
      data: {
        id: this.data.options.articleid,
        user_id: app.user.user_id,
        token: app.user.token
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '删除成功',
          icon: "success",
          duration: 3000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '删除失败',
          icon: "none",
          duration: 2000
        })
      }
    })
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
  //分类列表
  cateList() {
    app.api.home.cateList({
      token: app.user.token,
      user_id: app.user.user_id,
      class_id: app.user.class_id
    }).then(res => {
      if (res.response === 'data') {
        let role = app.user.user_role
        let is_parent = role == '2' ? true : false
        let list = res.list
        let Teacher_arr = [],
          Parent_arr = []
        list.forEach((val, key) => {
          if (is_parent) {
            if (val.cate_name == '请假') {
              Parent_arr.push(val)
            }
          } else {
            if (val.cate_name == '请假') {
              list.splice(key, 1)
            }
            Teacher_arr = list
          }
        })
        let arr = is_parent ? Parent_arr : Teacher_arr
        this.setData({
          list: arr
          // cate_id: arr[0].cate_id
        })
      }
    })
  },

  //发布内容类型
  changeActive(e) {
    let cate_id = e.target.dataset.id
    let cate_name = e.target.dataset.catename
    // let homeworkAuth = cate_name == '作业' ? true : false
    let params = this.data.params
    params.article_type = cate_id
    this.setData({
      params: params,
      cate_id,
      //  homeworkAuth
    })
  },

  //切换作业类型
  changeActiveHWT(e) {
    let hwt_id = e.target.dataset.id
    let params = this.data.params
    params.hwt_id = hwt_id
    this.setData({
      params: params,
      hwt_id
    })
  },
  //设置权限
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
    this.setData({
      handleStatus: false
    })
    var evalList = this.data.evalList;
    var imgNumber = evalList[0].tempFilePaths.length
    if (imgNumber >= 3) {
      wx.showModal({
        title: '提示',
        content: '最多上传三张图片/视频',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: (res) => {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseWxImage("album", imgNumber)
          } else if (res.tapIndex == 1) {
            this.chooseWxImage("camera", imgNumber)
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

        this.setData({
          evalList: evalList,
          showPlusIcon: showPlusIcon,
        })
        for (let i = 0; i < addImg.length; i++) {
          this.getOssParams(addImg[i], 'image')
        }
      }
    })
  },
  //删除图片
  clearImg(e) {
    let index = e.currentTarget.dataset.index
    let evalList = this.data.evalList
    let img = evalList[0].tempFilePaths
    let img_list = evalList[0].imgList
    let del_path = img[index].path
    if (!img[index].time) {
      let k = ''
      img_list.forEach((val, key) => {
        if (val.path === del_path) {
          k = key
        }
      })
      if (k >= 0) {
        img_list.splice(k, 1)
      }
    }
    let showPlusIcon = this.data.showPlusIcon
    img.splice(index, 1)
    if (img.length < 3) {
      showPlusIcon = true
    }
    evalList[0].tempFilePaths = img
    evalList[0].imgList = img_list
    this.setData({
      evalList,
      showPlusIcon
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
        obj.expire = reponseData.expire
        obj.type = type
        obj.path = path
        evalList[0].imgList.push(obj)
        console.log(evalList)
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
      article_content: descript,
      id: this.options.articleid,
      article_type: this.data.cate_id
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
    //包括新上传的跟原来上传的图片 需要取出原来上传的图片路径
    let temp = this.data.evalList[0]['tempFilePaths']
    if (temp.length > 0) {
      temp.forEach((val, key) => {
        if (val.time == 'old') {
          imgArray.push({
          [val.type] : val.path
          })
        }
      })
    }
    imgList.forEach((val, key) => {
      let keys = val.path.indexOf('tmp')
      let str = val.path.slice(keys)
      let obj = {
        [val.type]: val.expire + str
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
          title: '信息保存成功',
          icon: 'success',
          duration: 2000,
          success: (res) => {
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
              //清空表单
              this.setData({
                info: '',
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
                    on: true
                  },
                  {
                    index: 2,
                    type: '公开',
                    on: false
                  }
                ]
              })
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: res.error.message,
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
    this.setData({
      handleStatus: false
    })
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
