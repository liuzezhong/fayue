// pages/tickling/tickling.js
import $ from '../../../common/common.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickType: 0,
    fontNum: -10,
    feddbackType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      tickType: options.tickType,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  radioChange: function(e) {
    // 提交内容
    console.log(e.detail.value);
    this.setData({
      feddbackType: e.detail.value,
    });
  },


  bindFormSubmit: function(e) {
    var content = e.detail.value.textarea;
    var that = this;
    $.post(
      'fyapiprj/webService/feedback/addFeedback', {
        skey: wx.getStorageSync('skey'),
        feedbackContent: content,
        feedbackType: feddbackType,
      },
      function(res) {
        if (res.data.data != 0) {
          wx.showModal({
            title: '提交成功',
            content: '客服人员将在24小时内与您核实',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#FFD900',
            success: function(e) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showToast({
            title: '提交失败，请稍后再试！',
            icon: 'none',
          })
        }
      }
    )

  },

  bindContent: function(e) {
    this.setData({
      fontNum: e.detail.cursor - 10,
    });
  },

  bindPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: '4008591580',
    })
  }
})