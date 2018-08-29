// pages/personData/personData.js
let utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 'parent',
    relationshipIndex: 1,
    hobbyIndex: 1,
    workIndex: 1,
    date: '',
    radioCheckVal: 'woman',
    content: {},
    showObjInput: false,
    showshipInput: false,
    showhobbyInput: false,
    sex_list: [{
        name: 'man',
        value: '男'
      },
      {
        name: 'woman',
        value: '女',
        checked: true
      }
    ],
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
    ],
    hobby: [{
        like_id: 1,
        other_like: '足球'
      },
      {
        like_id: 2,
        other_like: '跑步'
      },
      {
        like_id: 3,
        other_like: '游泳'
      },
      {
        like_id: 4,
        other_like: '钓鱼'
      },
      {
        like_id: 5,
        other_like: '厨艺'
      },
      {
        like_id: 6,
        other_like: '电影'
      },
      {
        like_id: 7,
        other_like: '阅读'
      },
      {
        like_id: 8,
        other_like: '爬山'
      },
      {
        like_id: 9,
        other_like: '其他'
      }
    ],
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
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  switchShip(e) {
    let num = e.currentTarget.dataset.num
    let showshipInput = this.data.showshipInput
    if (num === 7) {
      showshipInput = showshipInput ? false : true
    } else {
      showshipInput = false
    }
    this.setData({
      relationshipIndex: num,
      showshipInput: showshipInput
    })
  },
  switchHobby(e) {
    let num = e.currentTarget.dataset.num
    let showhobbyInput = this.data.showhobbyInput
    if (num === 9) {
      showhobbyInput = showhobbyInput ? false : true
    } else {
      showhobbyInput = false
    }
    this.setData({
      hobbyIndex: num,
      showhobbyInput: showhobbyInput
    })
  },
  switchWork(e) {
    let num = e.currentTarget.dataset.num
    let showObjInput = this.data.showObjInput
    if (num === 6) {
      showObjInput = showObjInput ? false : true
    } else {
      showObjInput = false
    }

    this.setData({
      workIndex: num,
      showObjInput: showObjInput
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = this.data.role === 'teacher' ? 'user/userInfoTea' : 'user/userInfo'
    utils.wxpromisify({
      url: url,
      data: app.user,
      method: 'post'
    }).then((res) => {
      if (res && res.response === 'data') {
        let sex_list = this.data.sex_list
        if (res.data.gender === 2) {
          sex_list[0].checked = true
          sex_list[1].checked = false
        } else {
          sex_list[0].checked = false
          sex_list[1].checked = true
        }
        this.setData({
          content: res.data,
          sex_list: sex_list,
          date: res.data.birthday
        })
      }
    }).catch((err) => {})

  },
  getPhoneNumber() {

  },
  formSubmit(e) {
    //role is teacher
    let mobile = e.detail.value.tel.trim()
    let birthday = this.data.date
    let username = e.detail.value.username.trim()
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!username) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 5000
      })
      return
    }
    if (!birthday) {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none',
        duration: 5000
      })
      return
    }
    let gender = '',
      selObject = {}
    this.data.sex_list.forEach((val, key) => {
      if (val.checked) {
        gender = key + 1
      }
    })
  let selHobby = {},selShip={},selSubject={}
  if(this.data.role === 'parent'){
 //爱好
    let other_hobby = e.detail.value.other_like
    let showhobbyInput = this.data.showhobbyInput
    let hobbyItem = this.data.hobby
    let hobbyIndex = this.data.hobbyIndex
     selHobby = this.handlefn(showhobbyInput,other_hobby,'爱好','like_id','other_like',hobbyItem,hobbyIndex,9)
    console.log(selHobby)

    //亲属关系
    let other_ship = e.detail.value.family_role_name
    let showShipInput = this.data.showshipInput
    let familyItem = this.data.Relationship
    let familyIndex = this.data.relationshipIndex
     selShip = this.handlefn(showShipInput,other_ship,'关系','family_role','family_role_name',familyItem,familyIndex,7)
     console.log(selShip)
  }else{

  //课程
    let other_class = e.detail.value.subject_name
    let showObjInput = this.data.showObjInput
    let subjectItem = this.data.workItem
    let subjectIndex = this.data.workIndex
     selSubject = this.handlefn(showObjInput,other_class,'课程','subject_type','subject_name',subjectItem,subjectIndex,6)
     
console.log(selSubject)
  }
   

 

    let selVal = {
      ...app.user,
      username: username,
      gender: gender,
      mobile: mobile,
      birthday: birthday,
      ...selSubject,
      ...selShip,
      ...selHobby
    }
    console.log(selVal)
    // utils.wxpromisify({
    //   url: 'user/submitTeacherInfo',
    //   data: selVal,
    //   method: 'post'
    // }).then((res) => {
    //   if (res && res.response === 'data') {
    //     wx.showModal({
    //       title: '提示',
    //       content: '信息保存成功',
    //       showCancel: false,
    //       success: function () {
    //         console.log(2322)
    //         if (res.confirm) {
    //           wx.switchTab({
    //             url: '/pages/my/my'
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
  },


  handlefn(boolean,elem,elem_name,index,name,selItem,selIndex,num) {
    let obj ={}
    if (boolean) { //其他
      if (!elem) {
        wx.showToast({
          title: '请填写'+elem_name+'名称',
          icon: 'none',
          duration: 5000
        })
        return
      }
      obj.index = num
      obj.name = elem
    } else {
      let index = 0
      selItem.forEach((val, key) => {
        if (val.index == selIndex) {
          index = key
        }
      })
      obj = selItem[index]
    }
    return obj
  }
})
