// pages/discover/index/index.js
import $ from '../../../common/common.js';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ballShow: false,
    searchAlerts: true,
    lvdouappid: 'wx586501a5b03c99be',
    handpickActivity: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }
    if (new Date(wx.getStorageSync('ballShowDate')).toDateString() != new Date().toDateString()) {
      wx.setStorageSync('ballShow', true);
      wx.setStorageSync('ballShowDate', Date.now());
      
    }

    if (wx.getStorageSync('ballAllShow') != false) {
      this.setData({
        ballShow: wx.getStorageSync('ballShow'),
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
      'fyapiprj/webService/voteActivity/selected',
      {},
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          console.log('dfasdfasfasfasd');
          console.log(res.data.data);
          if (res.data.data.length != 0) {
            that.setData({
              handpickActivity: res.data.data,
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

  bindSure: function(e) {
    wx.setStorageSync('ballShow', false);
    this.setData({
      ballShow: false,
    });
  },

  bindAlerts: function(e) {
    // 不接受通知了
    var that = this;
    wx.showModal({
      title: '皇上，请三思！',
      content: '您将不再收到任何福利提醒',
      cancelText: '朕再想想',
      cancelColor: '#FFD900',
      confirmText: '朕意已决',
      confirmColor: '#000000',


      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('ballAllShow', false);
          wx.setStorageSync('ballShow', false);
          that.setData({
            ballShow: false,
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindActivityDetail: function(e) {
    // var activityid = e.currentTarget.dataset.activityid;
    // if (activityid) {
    //   wx.navigateTo({
    //     url: '../detail/detail?activityid=' + activityid,
    //   })
    // }else {
    //   wx.showToast({
    //     title: '活动ID获取失败',
    //     icon: 'none',
    //   })
    // }

    wx.navigateTo({
      url: '../expense/index/index',
    })
  },

  bindActivityList: function(e) {
    wx.navigateTo({
      url: '../list/list',
    })
  }
})