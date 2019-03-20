// pages/discover/sign/sign.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitSuccess: 0,
    lvdouappid: 'wx586501a5b03c99be',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (wx.getStorageSync('submitSuccess')) {
      this.setData({
        submitSuccess: wx.getStorageSync('submitSuccess'),
      });
    }
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

  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var formValue = e.detail.value;
    $.post(
      'fyapiprj/webService/activity/addActivity',
      {
        compoundName: formValue.compoundName,
        name: formValue.name,
        mobile: formValue.mobile,
        donationNumber: formValue.donationNumber,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        that.setData({
          submitSuccess: 1,
        });
        wx.setStorageSync('submitSuccess', 1);
      }
    )
  },
})