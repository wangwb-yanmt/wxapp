const app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  getPhone:function(e){
    console.log(e.detail);
  },
  //用户信息授权按钮绑定事件，未授权时会弹窗
  getUser:function(e){
    if(e.detail.userInfo){
      console.log("同意授权小程序获取微信个人信息");
      //app.js全局变量赋值
      app.globalData.userInfo = e.detail.userInfo;
    } else {
      console.log("不同意授权小程序获取微信个人信息");
    }
    //拿着openid去后台验证该openid是否属于系统内用户绑定过的微信用户
    wx.request({
      url: 'http://192.168.120.208:7777/TestController/checkWxuser',
      data:{
        openid: wx.getStorageSync('openid')
      },
      success:function(res){
        if(res.data.success){
          console.log("用户验证成功");
          //跳到首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          wx.showToast({
            title: '微信用户未绑定'
          })
        }
      }
    })
  }
})