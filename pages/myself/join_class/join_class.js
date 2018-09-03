// pages/myself/invit_teacher/invit_teacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selShipIndex: 1,
    showShipInput: false,
    Relationship: [{
        family_role: 1,
        family_role_name: '爸爸'
      },
      {
        family_role: 2,
        family_role_name: '妈妈'
      },
      {
        family_role: 3,
        family_role_name: '爷爷'
      },
      {
        family_role: 4,
        family_role_name: '奶奶'
      },
      {
        family_role: 5,
        family_role_name: '外公'
      },
      {
        family_role: 6,
        family_role_name: '外婆'
      },
      {
        family_role: 7,
        family_role_name: '其他'
      }
    ]
  },
  switchFamilyShip(e) {
    let num = e.currentTarget.dataset.num
    let showShipInput = this.data.showShipInput
    if (num === 6) {
      showShipInput = showShipInput ? false : true
    } else {
      showShipInput = false
    }
    this.setData({
      selShipIndex: num,
      showShipInput: showShipInput
    })
  },
  formSubmit(e) {
    let mobile = e.detail.value.mobile
    let username = e.detail.value.username
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!username) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 5000
      })

    }
    const bool = this.isPoneAvailable(mobile)
    if (!bool) {
      wx.showToast({
        title: '请正确填写手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let keys = this.data.selSubIndex
    let subObj = {}
    subObj.subject_type = this.data.selSubIndex
    if (keys == '6') {
      const other_subject_name = e.detail.value.subject_name
      subObj.subject_name = other_subject_name
    }
    const params = {
      mobile,
      username,
      ...subObj,
      user_id: app.user.user_id,
      token: app.user.token,
      class_id: app.user.class_id
    }
    utils.wxpromisify({
      url: 'user/addTeacher',
      data: params,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        wx.showToast({
          title: '邀请成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 2000)
      }
    })
  },

  isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
