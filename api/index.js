import home from './home.js'
import ajax from './ajax'

export default {
  home,
  // 登录
  loginStatus(param) {
    return ajax.post('user/loginStatus', param)
  },
  // 登录
  getPhoneNumber(param) {
    return ajax.post('user/login', param)
  }
}
