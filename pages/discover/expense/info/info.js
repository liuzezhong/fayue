// pages/discover/expense/info/info.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isApply: 1, // 是否可报销
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
      'fyapiprj/webService/rightsActivity/enabled/amount', {
        skey: wx.getStorageSync('skey'),
        activityId: 1,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/enabled/amount');
        console.log(res);
        if(res.data.state == -1) {
          that.setData({
            isApply: 0,
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.userInfo.nickName + '送您315元消费维权保障金，点击立即领取',
      path: '/pages/discover/expense/invite/invite?skey=' + wx.getStorageSync('skey'),
      imageUrl: 'http://imgbj.xianshikeji.com/315zhuanfa.jpg'
    }
  },

  bindAttend: function() {
    if(this.data.isApply == 0) {
      wx.showToast({
        title: '您的保障金已过期',
        icon:'none',
      })
    }else {
      wx.navigateTo({
        url: '../form/form',
      })
    }
    
  }
})