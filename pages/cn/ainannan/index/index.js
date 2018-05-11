//index.js
//获取应用实例
const app = getApp();
var fetch = require("../../../utils/fetch.js");
var commons = require('../../../utils/commons.js');

Page({
  data: {
    adage: {},
    outFlag: true
  },
  addBrowseRecord: function (userId, adageId) {
    fetch(`adage/addBrowseRecord?user.id=${userId}&adage.id=${adageId}`).then(res => {
      console.log(res);
    });
  },
  loadAdage: function (userId) {
    // 获取用户ID后获取谚语
    var that = this;
    fetch(`adage/getByUser?param.id=${userId}`).then(res => {
      var adage = res.data.data;
      if (res.data.status == '1') {
        commons.showTip("加载成功！", "none");
        that.setData({
          adage: adage
        });
        // 加载进缓存
        wx.setStorage({
          key: 'curAdage',
          data: adage,
        });
        // 谚语调取成功后添加浏览记录
        that.addBrowseRecord(userId, adage.id);

      } else if (res.data.status == '0') {
        commons.showTip(res.data.message, "none");
      }
    });
  },
  onLoad: function () {
    // 数据初始化
    // 先去缓存调取谚语
    let curAdage = wx.getStorageSync("curAdage");
    // 如果没有缓存谚语，再去缓存查找userId
    if (curAdage == "" || curAdage == null) {
      var userId = wx.getStorageSync("userId");
      var that = this;
      if (userId == "" || userId == null) {
        app.getUserKey().then(function (res) {
          if (res != null) {
            that.loadAdage(res);
          } else {
            commons.showTip("未登录", "none");
          }
        });
      } else {
        that.loadAdage(userId);
      }  
    }else{
      this.setData({
        adage: curAdage
      });
    }
  },
  collect: function(){
    // 收藏操作
    console.log(this.data.adage.id);
    console.log(wx.getStorageSync("userId"));
    fetch(`adage/addCollect?user.id=${app.getUserKey()}&adage.id=${this.data.adage.id}`).then(res => {
      if(res.data.status == '1'){
        commons.showTip("收藏成功！", "none");
      }else{
        commons.showTip(res.data.message , "none");
      }
      
    });
  },
  next: function(event){
    let flag = wx.getStorageSync("firstClickNext");
    // 首次点击下一个按钮
    if(!flag){
      this.setData({ outFlag: false });
      wx.setStorage({
        key: "firstClickNext",
        data: "true"
      })
    }
    
    let userId = app.getUserKey();
    var that = this;
    if (userId == "" || userId == null) {
      app.getUserKey().then(function (res) {
        if (res == null) {
          this.loadAdage(res);
        } else {
          // 未登录的操作
          console.log("未登录");
        }
      });
    } else {
      this.loadAdage(userId);
    }

  },
  hide: function(){
    this.setData({ outFlag: true });
  },
  onShareAppMessage: function(res){
    if(res.from == 'button'){
      console.log("来自页面内转发按钮");
    }
    return{
      title:'这真是',
      success: function(res){
        console.log("转发成功");
      },
      fail: function(res){
        console.log("转发失败");
      }
    }
  }
})
