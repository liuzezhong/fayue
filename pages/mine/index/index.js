// pages/mine/index/index.js
import $ from '../../../common/common.js';
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */

  data: {
    lvdouappid: 'wx586501a5b03c99be',
    hasUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
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
    if (wx.getStorageSync('authorization') == true) {
      this.setData({
        hasUserInfo: true,
      })
    } else {
      this.setData({
        hasUserInfo: false,
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

  bindService: function (e) {
    // 我的服务
  },

  bindCollection: function (e) {
    // 我的收藏
    wx.navigateTo({
      url: '../favorite/favorite',
    })
  },

  bindOrder: function (e) {
    // 我的订阅
    wx.navigateTo({
      url: '../order/order',
    })
  },

  bindTickling: function (e) {
    // 联系我们
    wx.navigateTo({
      url: '../tickling/tickling?tickType=0',  //0：联系我们，1：我要提问，2：我要纠错
    })
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    var that = this;
    $.post(
      'fyapiprj/webService/member/add',
      {
        skey: wx.getStorageSync('skey'),
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          wx.showToast({
            title: '微信授权成功',
            icon: 'none',
            success: function () {
              wx.setStorageSync('authorization', true)
              wx.setStorageSync('userInfo', res.data.data);
              that.onShow();
            }
          })
        } else {
          wx.showToast({
            title: res.data.fieldErrors.message,
            icon: 'none'
          })
        }
      }
    )
  },
})