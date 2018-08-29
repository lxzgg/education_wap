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
