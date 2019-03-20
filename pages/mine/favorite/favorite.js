// pages/mine/favorite/favorite.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleType: 0, // 0 百科 1 专题
    pageNO: 1,
    pageSize: 10,
    favoriteList: null,
    subjectNum: 0,
    wikiNum: 0,
    memberId: 1,
    favoriteSubjectList: null,
    favoriteWikiList: null,
    getAllArtice: false,
    hasData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var thats = this;
    wx.showLoading({
      title: '玩命加载中',
    })

    $.post(
      'fyapiprj/webService/article/listMyCollects', {
        skey: wx.getStorageSync('skey'),
        pageNo: this.data.pageNO,
        pageSize: this.data.pageSize,
        articleType: 0
      },
      function(res) {
        that.setData({
          favoriteWikiList: res.data.data.articleList,
          wikiNum: res.data.data.wikiNum,
          hasData: true,
        });
        wx.hideLoading();
      }
    )

    $.post(
      'fyapiprj/webService/article/listMyCollects', {
        skey: wx.getStorageSync('skey'),
        pageNo: thats.data.pageNO,
        pageSize: thats.data.pageSize,
        articleType: 1
      },
      function(res) {
        console.log(res);
        thats.setData({
          favoriteSubjectList: res.data.data.articleList,
          subjectNum: res.data.data.subjectNum,
          hasData: true,
        });

      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    var pageNo = this.data.pageNo + 1;
    $.post(
      'fyapiprj/webService/article/listMyCollects', {
        skey: wx.getStorageSync('skey'),
        pageNo: pageNO,
        pageSize: this.data.pageSize,
        articleType: 0
      },
      function(res) {
        if (res.data.data.articleList.length != 0) {
          var favoriteWikiList = that.data.favoriteWikiList;
          for (var i = 0; i < res.data.data.articleList.length; i++) {
            favoriteWikiList.push(res.data.data.articleList[i]);
          }
          that.setData({
            favoriteWikiList: favoriteWikiList,
            pageNo: pageNo,
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
          })
          that.setData({
            getAllArtice: true,
          });
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindChangeType: function() {
    this.setData({
      articleType: !this.data.articleType,
    });
  },

  bindSubjectDetail: function(e) {
    // 跳转专题详情页
    var detail_id = e.currentTarget.dataset.article_id;
    var special_id = e.currentTarget.dataset.subject_id;
    console.log('../../special/detail/detail?detail_id=' + detail_id + '&subject_id=' + special_id);
    wx.navigateTo({
      url: '../../special/detail/detail?detail_id=' + detail_id + '&subject_id=' + special_id,
    })
  },
  bindArticle: function(e) {
    var article_id = e.currentTarget.dataset.article_id;
    wx.navigateTo({
      url: '../../home/article/article?article_id=' + article_id,
    })
  },
})