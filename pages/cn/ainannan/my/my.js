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
    },
    user: {},
    onShowFlag: false
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
    });

    // 获取收藏及积分信息
    fetch(`adage/getUserCollectGoldCoin?id=${app.getUserKey()}`).then(res => {
      if(res.data.status == '1'){
        that.setData({
          user: res.data.data
        });
      } else {
        console.log("获取收藏及积分信息失败");
      }
    });

    this.setData({
      onShowFlag: true
    });

  },
  /**
  * 每次显示的时候刷新获取收藏及积分信息。
  */
  onShow: function () {
    if(this.data.onShowFlag){
      this.setData({
        onShowFlag: false
      });
    } else {
      // 获取收藏及积分信息
      var that = this;
      fetch(`adage/getUserCollectGoldCoin?id=${app.getUserKey()}`).then(res => {
        if (res.data.status == '1') {
          that.setData({
            user: res.data.data
          });
        } else {
          console.log("获取收藏及积分信息失败");
        }
      });
    }
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