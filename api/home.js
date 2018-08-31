import ajax from './ajax.js'

//首页
export default {
  // 轮播
  adList(param) {
    return ajax.post('index/adList', param)
  },
  // 文章列表
  article(param) {
    return ajax.post('index/article', param)
  },
  // 分类列表
  cateList(param) {
    return ajax.post('class_info/getIcon', param)
  },
  // 班级列表
  classList(param) {
    return ajax.post('class_info/classList', param)
  },
  // 创建班级
  addClass(param) {
    return ajax.post('class_info/addClass', param)
  }
}
