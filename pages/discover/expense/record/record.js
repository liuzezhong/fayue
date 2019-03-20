// pages/discover/expense/record/record.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordArray: null,
    noRecord: 0,
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
    wx.showLoading({
      title: '正在加载',
    })
    $.post(
      'fyapiprj/webService/rightsActivity/page/expenseReport', {
        skey: wx.getStorageSync('skey'),
        pageNo: 1,
        pageSize: 1000,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/page/expenseReport');
        console.log(res);
        if(res.data.data.length != 0) {
          that.setData({
            recordArray: res.data.data,
          });
        }else {
          that.setData({
            noRecord: 1,
          });
        }
        wx.hideLoading()

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
  onShareAppMessage: function (res) {

  },

  bindDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  }
})