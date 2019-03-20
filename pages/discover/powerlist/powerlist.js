// pages/discover/powerlist/powerlist.js

import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    powerList: null,
    pageNo: 1,
    pageSize: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        id: options.id,
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
      'fyapiprj/webService/energy/energyRecord',
      {
        id: this.data.id,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          if (res.data.data) {
            that.setData({
              powerList: res.data.data.energyRecord,
              powerNum: res.data.data.totalElements,
            });
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
    var that = this;
    var pageNo = this.data.pageNo + 1;

    $.post(
      'fyapiprj/webService/energy/energyRecord',
      {
        id: this.data.id,
        pageNo: pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          if (res.data.data) {
            var oldPowerList = that.data.powerList;
            var newPowerList = res.data.data.energyRecord;
            for (var i = 0; i < newPowerList.length; i++) {
              oldPowerList.push(newPowerList[i]);
            }

            that.setData({
              powerList: oldPowerList,
              pageNo: pageNo,
            });
          }
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})