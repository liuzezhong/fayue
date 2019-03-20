// pages/discover/expense/detail/detail.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportId: 0,
    recordDetail: null,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        reportId: options.id,
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
      'fyapiprj/webService/rightsActivity/get/expenseReport', {
        reportId: this.data.reportId,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/get/expenseReport');
        console.log(res);
        if (res.data.data.length != 0) {
          that.setData({
            recordDetail: res.data.data,
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

  bindCancel: function() {
    var that = this;

    wx.showModal({
      title: '确认取消申请',
      content: '取消申请后状态将无法恢复',
      success(res) {
        if (res.confirm) {
          $.post(
            'fyapiprj/webService/rightsActivity/cancel/expenseReport', {
              reportId: that.data.reportId,
            },
            function (res) {
              console.log('fyapiprj/webService/rightsActivity/cancel/expenseReport');
              console.log(res);
              if(res.data.state == 0) {
                wx.showToast({
                  title: '已取消',
                  icon: 'none'
                })
              }else {
                wx.showToast({
                  title: '取消失败',
                  icon: 'none'
                })
              }
              that.onShow();
            }
          )
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})