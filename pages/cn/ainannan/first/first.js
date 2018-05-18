// pages/cn/ainannan/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/cn/ainannan/index/index',
      });
    },3000);
  },

  skipFirst: function(){
    wx.switchTab({
      url: '/pages/cn/ainannan/index/index',
    })
  }
})