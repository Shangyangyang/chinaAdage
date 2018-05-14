//app.js

App({
  config: {
    apiBase: 'http://17doutu.viphk.ngrok.org/'
  },
  globalData: {
    userInfo: null,
    userId: null
  },
  getUserKey: function(){
    let localUserId = wx.getStorageSync("userId");
    if (localUserId != null && localUserId != ""){
      return localUserId;
    }
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
  formatDate: function(date) {
    // var date = new Date(Date.parse(date)); 
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    var dateTime = year + month + day;

    return dateTime;
  }, 
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  }, 
  onLaunch: function () {
    // 获取变量
    var that = this;

    // 判断用户登录时间
    let curDate = new Date();
    let localDate = wx.getStorageSync("curDate");
    if (localDate == null || localDate == '' || that.formatDate(curDate) != localDate){      
      wx.request({
        url: this.config.apiBase + 'sys/login/updateLoginDate',
        method: 'POST',
        data: {
          id: this.getUserKey(),
          lastLogin: curDate
        },
        header:{
          'content-type': 'application/json'
        },
        success: function (res) {
          // 新用户，更新登录时间
          wx.setStorage({
            key: 'curDate',
            data: that.formatDate(curDate),
          });
        }
      });
    }
  }
})