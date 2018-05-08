// pages/cn/ainannan/component/dict/dict-show.js
const app = getApp();
const fetch = require("../../../../utils/fetch.js");


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dictValue:{
      type: "String",
      value: "无"
    },
    dictName:{
      type: "String"
    }
  },
  attached: function () {
    //组件生命周期函数，在组件实例进入页面节点树时执行
    var that = this;

    fetch(`dict/getLabelByName`, {name: that.data.dictName, value: that.data.dictValue,})
    .then(res => {
      let label = res.data.data;
      that.setData({
        dictLabel: label
      });
    });
    
  },
  moved: function(e){
    console.log("moved执行"); 
  },
  detached: function (e) {
    console.log("detached执行");
  },
  /**
   * 组件的初始数据
   */
  data: {
    dictLabel: '无'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
