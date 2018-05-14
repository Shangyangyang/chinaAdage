const app = getApp();
var fetch = require("../../../utils/fetch.js");
var commons = require('../../../utils/commons.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 异步获取搜索记录
    var historyList = wx.getStorage({
      key: 'historyList',
      success: function(res) {
        console.log("getHistorySuccess");
        if(res.data != null){
          that.setData({
            historyList: res.data
          });
        }
      },
      fail: function(res){
        console.log("getHistoryFail");
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 点击回车操作
  searchHandle () {
    this.setData({ shops: [], pageIndex: 0, hasMore: true })
    this.searchList();
  },

  showSearchHandle() {
    this.setData({ searchShowed: true })
  },
  hideSearchHandle() {
    this.setData({ searchText: '', searchShowed: false })
  },
  clearSearchHandle() {
    this.setData({ searchText: '' })
  },
  searchChangeHandle(e) {
    this.setData({ searchText: e.detail.value })
  },
  /*搜索*/
  searchList: function(){
    console.log(this.data.searchText);
    var that = this;
    // 搜索操作

    // 搜索记录的保存
    // 如果缓存中搜索记录为空，将当前这一条添加到文件中。
    let historyArr = new Array();
    if (that.data.historyList == null || that.data.historyList.length == 0){
      console.log("searchList-if执行了。");
      historyArr.unshift(that.data.searchText);
    } else {
      // 有值的情况
      historyArr = that.data.historyList;
      // 如果值等于5条，则删除最老的搜索记录
      while(historyArr.length > 5){
        historyArr.pop();
      }
      // 未完成：在这里添加重复判断
      if(true){
        historyArr.pop();
      } else {
        historyArr.unshift(that.data.searchText);
      }
    }

    // 放到js变量池中
    that.setData({
      historyList: historyArr
    });

    // 放到本地缓存中
    wx.setStorage({
      key: 'historyList',
      data: historyArr,
    });

    // 放到服务器数据库中
    fetch(`searchHistory/saveSearchHistory?content=${that.data.searchText}`).then(res => {
      if(res.data.status == '1'){
        console.log("添加搜索记录到服务器中成功。");
      }
    })
  }
})