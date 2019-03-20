// pages/discover/expense/success/success.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    contentArray: null,
    lvdouappid: 'wx586501a5b03c99be',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        type: options.type,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    $.post(
      'fyapiprj/webService/rightsActivity/get/rightsCarousel', {
        region: 2, // 成功页面
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/get/rightsCarousel');
        console.log(res.data);
        if (res.data.data.length != 0) {
          that.setData({
            contentArray: res.data.data,
          });
        }

      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindArticle: function (e) {
    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../home/article/article?article_id=' + article_id,
    })
  },

  bindSubjectList: function (e) {
    // 跳转专题列表页
    var special_id = e.currentTarget.dataset.subid;
    console.log(special_id);
    wx.navigateTo({
      url: '../../../special/list/list?special_id=' + special_id,
    })
  },
})