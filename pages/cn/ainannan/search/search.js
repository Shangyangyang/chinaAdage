const app = getApp();
var fetch = require("../../../utils/fetch.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: null,
    hotList: {},
    hotShowFlag: false, // 热门搜索区开关
    noneFlag: true,     // 搜索无结果开关
    searchList: {},
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    // 异步获取热门搜索
    fetch(`searchHistory/getHotList`).then(res => {
      console.log(res.data.data);
      if(res.data.status == '1'){
        that.setData({
          hotList: res.data.data
        });
      }
    });
    
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

  // 点击搜索框
  showSearchHandle() {
    this.setData({ searchShowed: true, hotShowFlag: false })
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
  selectHistory: function(e){
    this.setData({
      searchText: e.currentTarget.dataset.content
    });
  },
  /*搜索*/
  searchList: function(){
    var that = this;
    // 搜索操作

    // 搜索记录的保存
    // 如果缓存中搜索记录为空，将当前这一条添加到文件中。
    let historyArr = new Array();
    if (that.data.historyList == null || that.data.historyList.length == 0){
      historyArr.unshift(that.data.searchText);
    } else {
      // 有值的情况
      historyArr = that.data.historyList;
      // 如果值等于5条，则删除最老的搜索记录
      while(historyArr.length > 5){
        historyArr.pop();
      }
      // 未完成：在这里添加重复判断
      let index = historyArr.indexOf(that.data.searchText);
      if (index > -1){
        historyArr.splice(index, 1);
      }else{
        historyArr.pop();
      }
      historyArr.unshift(that.data.searchText);
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

    // 搜索
    var gjz = that.data.searchText;
    
    fetch(`adage/searchList?param.id=${app.getUserKey()}&adage=${that.data.searchText}`).then(res => {
      if(res.data.status == '1'){
        let database = res.data.data;
        if(database.length > 0){
          // 标红。
          let hilight_word = function (key, word) {
            let idx = word.indexOf(key);
            let t = [];
            if (idx > -1) {
              if (idx == 0) {
                t = hilight_word(key, word.substr(key.length));
                t.unshift({ key: true, str: key });
                return t;
              }
              if (idx > 0) {
                t = hilight_word(key, word.substr(idx));
                t.unshift({ key: false, str: word.substring(0, idx) });
                return t;
              }
            }
            return [{ key: false, str: word }];
          };
          // 赋值


          let searched = [];

          for (let i = 0; i < database.length; i++) {
            var current_word = database[i];
            if (current_word.adage.indexOf(gjz) > -1) {
              searched.push(hilight_word(gjz, current_word.adage))
            }
          }

          that.data.result = searched;
          that.setData(that.data);

          that.setData({
            hotShowFlag: true,
            noneFlag: true
          });

        }else{
          that.setData({
            noneFlag: false
          });
        }        
      }
    });

    // 清空搜索框
    that.setData({searchShowed: false });
  },
  selectHotSearch: function(e){
    this.setData({
      searchText: e.currentTarget.dataset.content
    });
    
    this.searchList();
  }
})