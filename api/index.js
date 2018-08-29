import home from './home.js'
import ajax from './ajax'

export default {
  home,
  // 登录
  loginStatus(param) {
    return ajax.post('user/loginStatus', param)
  },
  // 获取手机号码
  getUserMobile(param) {
    return ajax.post('user/getUserMobile', param)
  }
}
