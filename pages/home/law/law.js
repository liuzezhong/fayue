// pages/law/law.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id: 0, 
    lawList: null,
    lvdouappid: 'wx586501a5b03c99be',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var article_id = options.article_id;
    this.setData({
      article_id: article_id,
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
    var that = this;
    $.post(
      'fyapiprj/webService/article/lawList?articleId=' + this.data.article_id,
      {},
      function (res) {
        console.log(res);
        that.setData({
          lawList : res.data.data,
        });

      }
    )
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
  
  }
})