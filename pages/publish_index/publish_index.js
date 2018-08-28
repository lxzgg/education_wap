//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        windowWidth:'',
        navData:[
            {
                text: '全部(1)',
                id:1
            },
            {
                text: '教育辅导(1)',
                id:2
            },
            {
                text: '亲子读书',
                id:3
            },
            {
                text: '艺术兴趣',
                id:4
            },
            {
                text: '班级精彩',
                id:5
            },
            {
                text: '户外运动',
                id:6
            },
            {
                text: '美食',
                id:7
            },
            {
                text: '上课',
                id:8
            },
            {
                text: '下课',
                id:9
            }
        ],
        currentTab: 0,
        navScrollLeft: 0
    },
    //事件处理函数
    onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
    },
    switchNav(event){
        var cur = event.currentTarget.dataset.current;
        console.log(event.currentTarget.dataset.id);
        //每个tab选项宽度占1/5
        var singleNavWidth = this.data.windowWidth / 5;
        //tab选项居中
        this.setData({
            navScrollLeft: (cur - 2) * singleNavWidth
        })
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
})