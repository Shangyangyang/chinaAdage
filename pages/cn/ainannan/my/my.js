// pages/cn/ainannan/my/my.js
const app = getApp();
var fetch = require("../../../utils/fetch.js");
var commons = require('../../../utils/commons.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    //用户个人信息  
    userInfo: {
      avatarUrl: "",//用户头像  
      nickName: "",//用户昵称  
      hasUserInfo: false
    } 
  },

  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
})