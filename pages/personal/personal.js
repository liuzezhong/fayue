// pages/personal/personal.js

import $ from '../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal_id: 0,
    authorInfo: null,
    pageNo: 1,
    pageSize: 10,
    authorArticleList:null,
    authorArticle: null,
    getAllArtice: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var personal_id = options.personal_id;
    this.setData({
      personal_id: personal_id,
    });
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
    $.post(
      'fyapiprj/webService/author/getAuthorDetail?authorId=' + this.data.personal_id,
      {},
      function (res) {
        console.log(res.data);
        that.setData({
          authorInfo: res.data.data.author,
          authorArticle: res.data.data.article,
        });
      }
    )

    $.post(
      'fyapiprj/webService/article/getAuthorArticle?authorId=' + thats.data.personal_id + '&pageNo=' + thats.data.pageNo + '&pageSize=' + thats.data.pageSize,
      {},
      function (res) {
        console.log(res.data);
        thats.setData({
          authorArticleList: res.data.data.articleList.data,
        });

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
      'fyapiprj/webService/article/getAuthorArticle?authorId=' + this.data.personal_id + '&pageNo=' + pageNo + '&pageSize=' + this.data.pageSize,
      {},
      function (res) {
        console.log(res.data);
        var newAuthorArticleList = res.data.data.articleList.data;
        if (newAuthorArticleList.length != 0) {
          var authorArticleList = that.data.authorArticleList;
          for (var i = 0; i < newAuthorArticleList.length; i++) {
            authorArticleList.push(newAuthorArticleList[i]);
          }
          that.setData({
            authorArticleList: authorArticleList,
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
  onShareAppMessage: function () {

  },

  bindArticle: function (e) {
    console.log(e);
    var article_id = e.currentTarget.dataset.id;
    //var article_type = e.currentTarget.dataset.type;
    var article_type = 0;
    if(article_type == 0) {
      // 百科文章
      wx.navigateTo({
        url: '../home/article/article?article_id=' + article_id,
      })
    } else if (article_type == 1) {
      // 专题文章
      wx.navigateTo({
        url: '../special/detail/detail?detail_id=' + article_id,
      })
    }
    
  },
})