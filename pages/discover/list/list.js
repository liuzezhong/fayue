// pages/discover/list/list.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: null,
    pageNo: 1,
    pageSize: 10,
    getAllArtice: false,
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
    var that = this;
    $.post(
      'fyapiprj/webService/voteActivity/listVoteActivity',
      {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        if (res.data.state == 0) {
          var activityList = res.data.data;

          if (activityList.length != 0) {
            for (var i = 0; i < activityList.length; i++) {
              if (activityList[i].activityDesc.length > 42) {
                activityList[i].activityDesc = activityList[i].activityDesc.substring(0, 42) + '…';
              }
            }
          }
          that.setData({
            activityList: activityList,
          })
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    var pageNo = this.data.pageNo + 1;

    $.post(
      'fyapiprj/webService/voteActivity/listVoteActivity',
      {
        pageNo: pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log('****刷新开始****');
        console.log(res.data);
        console.log('****刷新结束****');

        if(res.data.state == 0) {
          if(res.data.data.length != 0) {
            var oldActivityList = that.data.activityList;
            var newActivityList = res.data.data;
            for (var i = 0; i< newActivityList.length; i++) {
              oldActivityList.push(newActivityList[i]);
            }
            that.setData({
              activityList : oldActivityList,
              pageNo: pageNo,
            });
            wx.hideLoading();
          }else {
            wx.hideLoading();
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
            });
            that.setData({
              getAllArtice: true,
            });
          }
        }else {
          wx.showToast({
            title: '加载失败，请稍后再试',
            icon: 'none',
          })
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindActivityDetail: function (e) {
    
    var activityid = e.currentTarget.dataset.activityid;
    if (activityid) {
      wx.navigateTo({
        url: '../detail/detail?activityid=' + activityid,
      })
    } else {
      wx.showToast({
        title: '活动ID获取失败',
        icon: 'none',
      })
    }

  }
})