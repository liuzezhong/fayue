// pages/special/index/index.js
import $ from '../../../common/common.js';
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialList: [],
    pageSize: 10,
    pageNo: 1,
    carouselSize: 4,
    carouselList:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
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
    var thats = this;
    wx.showLoading({
      title: '玩命加载中',
    });

    $.post(
      'fyapiprj/webService/carousel/subject?size=' + thats.data.carouselSize,
      {},
      function (res) {
        console.log('*****lunbo******');
        console.log(res.data);
        console.log('*****lunbo******');
        thats.setData({
          carouselList: res.data.data,
        });

      }
    )

    $.post(
      'fyapiprj/webService/subject/listArticleSubject?pageSize='+ this.data.pageSize +'&pageNo=' + this.data.pageNo,
      {},
      function (res) {
        console.log(res.data);
        that.setData({
          specialList: res.data.data,
        });
        wx.hideLoading();
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
    wx.showLoading({
      title: '玩命加载中',
    })
    var pageNo = this.data.pageNo + 1;
  
    $.post(
      'fyapiprj/webService/subject/listArticleSubject?pageSize=' + this.data.pageSize + '&pageNo=' + pageNo,
      {},
      function (res) {
        console.log(res.data);

        if (res.data.data.length != 0) {
          var specialList = that.data.specialList;
          for (var i = 0; i < res.data.data.length; i++) {
            specialList.push(res.data.data[i]);
          }
          that.setData({
            specialList: specialList,
            pageNo: pageNo,
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          // wx.showToast({
          //   title: '喂喂，法律都是有底线的！',
          //   icon: 'none',
          // })
          that.setData({
            getAllList: true,
          });
        }

      }
    )

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindDetail: function(e) {
    wx.navigateTo({
      url: '../list/list?special_id=' + e.currentTarget.dataset.id,
    })
  }
})