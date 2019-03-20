// pages/mine/order/order.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 10,
    orderList: null,
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
    var that = this;
    $.post(

      'fyapiprj/webService/subject/mySubscribe',
      {
        skey: wx.getStorageSync('skey'),
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log(res.data);
        if (res.data.data.data.length != 0) {
          that.setData({
            orderList: res.data.data.data,
          });
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

  },

  bindSubjectList: function (e) {
    // 跳转专题列表页
    var special_id = e.currentTarget.dataset.subid;
    console.log(special_id);
    wx.navigateTo({
      url: '../../special/list/list?special_id=' + special_id,
    })
  },

  bindSubject: function(e) {
    console.log(e);
    wx.switchTab({
      url: '../../special/index/index'
    })
  }
})