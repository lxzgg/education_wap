// pages/banner_control/banner_control.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isSort:0,
      list:[
          {id:1,src:'/image/banner1.jpg'},
          {id:2,src:'/image/banner2.jpg'},
      ]
  },
    // 开启排序
  setSort(e){
      this.setData({
          isSort:e.currentTarget.dataset.num
      })
  },
  down(e){
      let index = e.currentTarget.dataset.index;
      let temp_list = this.data.list;
      let temp_item = temp_list.splice(index,1)[0]
      temp_list.splice(index+1,0,temp_item)
      this.setData({
          list:temp_list
      })
  },
  up(e){
      let index = e.currentTarget.dataset.index;
      let temp_list = this.data.list;
      let temp_item = temp_list.splice(index,1)[0]
      temp_list.splice(index-1<0?0:index-1,0,temp_item)
      this.setData({
          list:temp_list
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