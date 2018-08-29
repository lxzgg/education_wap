var Promise = require('./bluebird.min')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */

var wxpromisify = function(params){
    // let uploadUrl = 'http://xiaoyuan.hngtsm.cn/'
  let baseurl = 'https://xiaoyuan.whwhjy.com/mobile/'
  let methods = params.method ? params.method : 'get'
//   userId = get
//    param.data.user_id = wx.getStorage('userInfo')

    return new Promise(function (resolve, reject) {
        wx.request({
            url: baseurl+params.url,
            data: params.data,
            method: methods , 
            success: function (res) {
                resolve(res.data)
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}
module.exports = {
  formatTime: formatTime,
  wxpromisify: wxpromisify
}
