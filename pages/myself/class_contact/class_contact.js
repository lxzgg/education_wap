// pages/myself/class_contact/class_contact.js
const app = getApp()
const utils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      teacherList:[],
      parentList:[],
      tearchTotal: 0,
      parentTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用户
    utils.wxpromisify({
      url:'user/userTelBook',
      data:{
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method:'post'
    }).then((res)=>{
       if(res && res.response === 'data'){
         this.setData({
           parentList: res.list
         })
       }else{
          this.setData({
           parentList: []
         })
       }
    })

    //教师
    utils.wxpromisify({
      url:'user/teaTelBook',
      data:{
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id
      },
      method:'post'
    }).then((res)=>{
      if(res && res.response === 'data'){
         this.setData({
           teacherList: res.list
         })
       }else{
          this.setData({
           teacherList: []
         })
       }
    })
  },
  delete(e){
    let del_user_id = e.currrentTarget.dataset.id
     utils.wxpromisify({
      url:'user/delTel',
      data:{
        token: app.user.token,
        user_id: app.user.user_id,
        class_id: app.user.class_id,
        del_user_id,
      },
      method:'post'
    }).then((res)=>{
      if(res && res.response === 'data'){
        wx.showToast({
          title:'删除成功',
          icon:'success'
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
  invitParent(){
     wx.navigateTo({
      url: '/pages/myself/join_class/join_class'
    })
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
