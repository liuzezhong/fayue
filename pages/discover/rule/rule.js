// pages/discover/rule/rule.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ruleInfo: null,
    activityruleid: 1,
    activityType: 1, // 1为投票活动 2为圣诞节活动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.activityruleid) {
      this.setData({
        activityruleid: options.activityruleid,
      });
    }
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
      'fyapiprj/webService/voteActivity/rule',
      {
        activityRuleId: this.data.activityruleid,
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            ruleInfo: res.data.data,
            activityType: res.data.data.type,
          })
        }
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