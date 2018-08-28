// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox_list:[
      {
        index: 0,
        value: 'parent',
        label:'家长',
        checks:true
      },
      {
        index: 1,
        value: 'teacher',
        label:'教师',
        checks: false
      }
    ]
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

  changeBox(e){
    let index = e.target.dataset.index
    let data_boxList = this.data.checkbox_list.map(function(val,key,arr){
      val.checks = val.index === index ? true : false
      return val;
    })
     this.setData({
          checkbox_list: data_boxList
     })
  },
  goToAccount(){
     wx.navigateTo({
      url:'../account/account'
    })
  }
})