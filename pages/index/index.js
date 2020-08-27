//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    array:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      var userInfo = app.globalData.userInfo;
      this.setData({
        userInfo: userInfo
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    this.queryList();
  },
  queryList:function(){
    var that = this;
    wx.request({
      url: 'http://192.168.120.208:7777/TestController/getList',
      method: 'POST',
      data:{
        pageNo:1,
        limit:20
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        var data = res.data;
        that.setData({
          array:data.body.data
        });
      }
    })
  },
  xinban:function(){
    // 保留当前页（可以返回来），页面栈最多十层
    wx.navigateTo({
      url: '/pages/add/add'
    })
  }
















})
