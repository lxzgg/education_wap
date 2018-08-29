// pages/myself/invit_teacher/invit_teacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selSubIndex: 1,
    showObjInput: false,
    workItem: [{
        subject_type: 1,
        subject_name: '语文'
      }, {
        subject_type: 2,
        subject_name: '英语'
      },
      {
        subject_type: 3,
        subject_name: '数学'
      },
      {
        subject_type: 4,
        subject_name: '化学'
      },
      {
        subject_type: 5,
        subject_name: '物理'
      }, {
        subject_type: 6,
        subject_name: '其他'
      }
    ]
  },
  switchSubject(e) {
    let num = e.currentTarget.dataset.num
    let showObjInput = this.data.showObjInput
    if (num === 6) {
      showObjInput = showObjInput ? false : true
    } else {
      showObjInput = false
    }
    this.setData({
      selSubIndex: num,
      showObjInput: showObjInput
    })
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

  }
})
