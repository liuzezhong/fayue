// pages/discover/expense/share/share.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitFriend: 0, // 邀请好友数量
    invitSumMoney: 0, //累计获得金额
    invitArray: null,
    userInfo: null,
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
    // 获取累计兑换保障金额
    $.post(
      'fyapiprj/webService/rightsActivity/sum/paymentAmount', {
        skey: wx.getStorageSync('skey'),
        type: 0, // 收支类型，0收入，1支出
        paymentType: 3, // 	类型说明：0初始，1答题，2步数兑换，3分享；10报销
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/sum/paymentAmount');
        console.log(res);
        if (res.data.data != -1) {
          that.setData({
            invitSumMoney: res.data.data,
          });
        }
      }
    )

    // 获取累计邀请好友总数量
    $.post(
      'fyapiprj/webService/rightsActivity/count/invitedMember', {
        skey: wx.getStorageSync('skey'),
        activityId: 1,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/count/invitedMember');
        console.log(res);
        if (res.data.data) {
          that.setData({
            invitFriend: res.data.data,
          });
        }
      }
    )

    // 获取邀请好友列表
    $.post(
      'fyapiprj/webService/rightsActivity/page/invitedMember', {
        skey: wx.getStorageSync('skey'),
        activityId: 1,
        pageNo: 1,
        pageSize: 1000,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/page/invitedMember');
        console.log(res);
        if (res.data.data.length != 0) {
          that.setData({
            invitArray: res.data.data,
          });
        }
      }
    )

    // 获取用户信息
    $.post(
      'fyapiprj/webService/rightsActivity/get/member', {
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/get/member');
        console.log(res);
        if (res.data.data.length != 0) {
          that.setData({
            userInfo: res.data.data,
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

  formSubmit: function (e) {
    var that = this
    var formId = e.detail.formId;
    var content = e.detail.target.dataset.name//记录用户的操作
    console.log('form发生了submit事件，推送码为：', formId)
    console.log('button点击事件来自：', content)


    var that = this;
    $.post(
      'fyapiprj/webService/subject/addFormId',
      {
        skey: wx.getStorageSync('skey'),
        formId: formId,
      },
      function (res) {
        console.log(res);
      }
    )
  },

  bindRule: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
})