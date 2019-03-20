// pages/discover/wishlist/wishlist.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityid: 7,
    topSize: 100, //获取前几名
    rankList: null,
    activityType: 1, // 1为投票活动 2为圣诞节活动
    awardId: 17,
    rank: null,
    successRanking: null,
    awardInfo: null,
    winningNumber: 0,
    awardNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activityid) {
      this.setData({
        activityid: options.activityid,
      });
    }
    if (options.awardId) {
      this.setData({
        awardId: options.awardId,
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
    if (wx.getStorageSync('authorization') == true) {
      var skey = wx.getStorageSync('skey');
    } else if (wx.getStorageSync('authorization') == false) {
      var skey = '';
    }
    $.post(
      'fyapiprj/webService/voteActivity/getVoteActivityRanking',
      {
        activityId: this.data.activityid,
        topSize: this.data.topSize,
        awardId: this.data.awardId,
        skey: skey,
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            awardInfo: res.data.data.award,
            successRanking: res.data.data.successRanking,
            rankList: res.data.data.ranking,
            activityType: res.data.data.activityType,
            winningNumber: res.data.data.winningNumber,
            awardNumber: res.data.data.awardNumber,
          })

          if (res.data.data.rank) {
            that.setData({
              rank: res.data.data.rank,
            })
          }
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

  bindUserEnergy: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../energy/energy?selectId=' + e.currentTarget.dataset.id,
    })
  }
})