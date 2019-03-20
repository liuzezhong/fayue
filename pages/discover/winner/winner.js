// pages/discover/winner/winner.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    awardId: 17, // 奖品ID
    awardInfo: null,
    publicityList: null,
    myRank: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.awardId) {
      this.setData({
        awardId : options.awardId,
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
      'fyapiprj/webService/energy/awardPublicity',
      {
        awardId: this.data.awardId,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            awardInfo: res.data.data.award,
            publicityList: res.data.data.publicityList,
            myRank: res.data.data.rank,
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