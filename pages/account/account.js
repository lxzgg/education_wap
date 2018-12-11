
//let util = require('../../utils/util.js')
Page({

  data: {

  },
  onGotUserInfo: function(e) {
    console.log(e)
    let status = e.detail.errMsg
    if(status  === "getUserInfo:ok"){
      //已同意授权
    }else{
      //拒绝授权
    }
  }
  
})