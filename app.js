//app.js

App({
  config: {
    apiBase: 'http://localhost:8080/'
  },
  globalData: {
    userInfo: null,
    userId: null
  },
  getUserKey: function(){
    if(this.globalData.userId == null){
      var that = this;
      return new Promise(function (resolve, reject) {
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: that.config.apiBase + "sys/login/login",
              data: {
                code: res.code
              },
              success: function (res) {
                that.globalData.userId = res.data.data;
                resolve(that.globalData.userId);
                wx.setStorage({
                  key: "userId",
                  data: that.globalData.userId
                });
              }
            });
          }
        })
      });
    } else {
      return this.globalData.userId;
    }
  },
  onLaunch: function () {
    // 获取变量
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})