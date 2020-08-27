//app.js
App({
  onLaunch: function () {
    wx.checkSession({
      success: (res) => {
        console.log("处于登录态");
      },
      fail:function(res){
        //登录
        wx.login({
          success: res => {
            var code = res.code;
            console.log("code获取成功："+code);
            wx.request({
              url: 'http://192.168.120.208:7777/TestController/getWxcode',
              data:{code:code},
              success:function(res){
                var session_key = res.data.session_key;
                var openid = res.data.openid;
                wx.setStorageSync('session_key', session_key);
                wx.setStorageSync('openid', openid);
                console.log("session_key获取成功："+session_key);
                console.log("openid获取成功："+openid);
              }
            })
          }
        })
      }
    })
    // 获取用户设置
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权过小程序获取微信个人信息");
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          console.log('未授权小程序获取微信个人信息');
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})