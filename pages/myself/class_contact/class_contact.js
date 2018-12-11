// pages/myself/class_contact/class_contact.js
const app = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherList: [],
    parentList: [],
    tearchTotal: 0,
    parentTotal: 0,
    showModalStatus: false,
    qrcode: '',//生成的二维码图片
    shareImg:'',//canvas生成的图片
    windowWidth: 240,
    windowHeight: 300,
    current_user_id: '',
    is_admin: false, //是否管理员
    teacher_phone: false, //拨打电话按钮
    parent_phone: false, //拨打电话按钮
    disabled_del: false,//删除按钮
    class_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let role = app.user.user_role //0 无角色 2家长 1教师
    //let is_teacher = role != '2' ? true : false
    if(role == '1'){ //可拨打电话 无删除权限
        this.setData({
          teacher_phone: true,
          parent_phone: true,
          disabled_del: false
        })
    }else if(role == '2'){ //
      this.setData({
          teacher_phone: true,
          parent_phone: false,
          disabled_del: false
        })
    }else{
      this.setData({
          teacher_phone: true,
          parent_phone: true,
          disabled_del: true
        })
    }
    if(app.user.is_admin == '1'){
      this.setData({is_admin: true})
    }
  
    this.setData({
     current_user_id: app.user.user_id
    })

    //用户
    utils.wxpromisify({
      url: 'user/userTelBook',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        let parentTotal = parseInt(res.list.length)
        this.setData({
          parentList: res.list,
          parentTotal
        })
      } else {
        this.setData({
          parentList: []
        })
      }
    })

    //教师
    utils.wxpromisify({
      url: 'user/teaTelBook',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        let tearchTotal = parseInt(res.list.length)
        this.setData({
          teacherList: res.list,
          tearchTotal
        })
      } else {
        this.setData({
          teacherList: []
        })
      }
    })
    this.createqrCode()
    this.getClassName()
  },
  delete(e) {
    let del_user_id = e.currentTarget.dataset.id
    utils.wxpromisify({
      url: 'user/delTel',
      data: {
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id,
        del_user_id,
      },
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        this.onLoad()
      }
    })
  },
  invitTeacher() {
    wx.navigateTo({
      url: '/pages/myself/invit_teacher/invit_teacher'
    })
  },
  //生成二维码
  createqrCode() {
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
      if (res && res.response === 'data') {
        let qrcode = res.data.qrcode
        this.setData({
          qrcode
        })
      }
    })
  },

  //邀请
  onShareAppMessage: function (e) {
    return {
      title: '邀请您加入`' + this.data.class_name + '`',
      imageUrl: '/image/xiaohaoge.png',
      path: 'pages/myself/invit_teacher/invit_teacher?handle=invitTeacher&class_id=' + app.user.class_id // 路径，传递参数到指定页面。
    }

  },
  //显示对话框
  showModal: function () {
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

      wx.getImageInfo({
        src: this.data.qrcode,
        success: (res) => {
          const username = app.username ? app.username : ''
          const class_name = app.class_name
          this.drawImg(username, class_name, res.path)
        }
      })
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
    wx.showModal({
      title: '提示',
      content: '保存该图片，可以分享给其他老师或者家长',
      success: (res) => {
        if (res.confirm) {
          let qrcode = this.data.shareImg
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
  callPhone(e) {
    let phone = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  //获取当前班级名称
  getClassName() {
    utils.wxpromisify({
      url: 'class_info/info',
      data: app.user,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        let class_name = res.data.class_name
        this.setData({
          class_name
        })
      }
    })
  },
  drawImg(name, class_name, tempPath) {
    const ctx = wx.createCanvasContext('qrcodeImg')
    // var imgPath = '/image/index.png'; //二维码
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, this.data.windowWidth, this.data.windowHeight) //填充一个矩形
    ctx.setFillStyle('black')
    ctx.setFontSize(14)
    const title = name + '邀请您加入`' + class_name + '`'
    ctx.fillText(title, (this.data.windowWidth - ctx.measureText(title).width) / 2, 40)
    ctx.setFillStyle('#fff')
    ctx.drawImage(tempPath, 45, 60, 150, 145); //显示图片 (img,sx,sy,swidth,sheight,x,y,width,height)
    ctx.setFontSize(12)
    ctx.setFillStyle('#666')
    const tips = '长按图片识别二维码'
    ctx.fillText(tips, (this.data.windowWidth - ctx.measureText(tips).width) / 2, 230)
    ctx.draw(false, setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        destWidth: 600,//this.data.windowWidth,
        destHeight: 600,//this.data.windowHeight,
        canvasId: 'qrcodeImg',
        success: (res) => {
          this.setData({
             shareImg: res.tempFilePath,
        //qrcode: res.tempFilePath
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
