// pages/search/index/index.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResault: null,

    resaultNumber: 0,
    inputValue: '',
    resaultType: 1, //1综合 2百科 3专题
    search_type: 1, // 1正常搜索，2按标签搜索
    pageNo: 1,
    pageSize: 10,
    searchType: 0,
    searchMode: 0,
    artcleNum: 0,
    subjectNum: 0,
    searchRecord: null,
    inputWantValue:null,
    hotKeyList: null,
    lvdouappid: 'wx586501a5b03c99be',
    recommendResults: null,
    hasnoResault:0, // 0 默认  1 有结果 -1  没有结果
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    if (options.search_input) {
      var search_input = options.search_input;
      this.setData({
        inputValue: search_input,
      });
      this.bindSearch()
    }

    if (options.search_type) {
      var search_type = options.search_type;
      this.setData({
        search_type: search_type,
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
    wx.showLoading({
      title: '玩命加载中',
    })
    var searchRecord = wx.getStorageSync('searchRecord') || [];
    if (searchRecord.length != 0) {
      this.setData({
        searchRecord: searchRecord,
      });
    }
    $.post(
      'fyapiprj/webService/article/getHotSearchList?pageNo=1&pageSize=10',
      {},
      function (res) {
        console.log(res.data.data.data);

        that.setData({
          hotKeyList: res.data.data.data,
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
      'fyapiprj/webService/article/searchList?q=' + this.data.inputValue + '&pageNo=' + pageNo + '&pageSize=' + this.data.pageSize + '&type=' + this.data.searchType + '&mode=' + this.data.searchMode,
      {},
      function (res) {
        console.log(res.data.data.searchResult.data);
        var newSearchResault = res.data.data.searchResult.data;
        if (newSearchResault.length != 0) {

          
          var searchResault = that.data.searchResault;
          for (var i = 0; i < newSearchResault.length; i++) {
            newSearchResault[i].content = newSearchResault[i].content.substring(0, 27);
            searchResault.push(newSearchResault[i]);
          }


          that.setData({
            searchResault: searchResault,
            pageNo: pageNo,
          });
          
        } else {
          // 没搜索到结果
          wx.hideLoading();
        }

      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindNoQuestion: function () {
    wx.showActionSheet({
      itemList: ['免费问律师', '我要提问'],
      success: function (res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0) {
          wx.navigateBackMiniProgram({
            appId: 'wx586501a5b03c99be',
            path:'pages/quick_consolt/quick_consolt',
            success: function(e) {
              console.log('success');
            },
            fail: function(e) {
              console.log('fail');
            }
          })
        }else if(res.tapIndex == 1) {
          wx.navigateTo({
            url: '../../mine/tickling/tickling?tickType=1',
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  bindKeyInput: function (e) {
    var that = this;
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindClearInput: function (e) {
    this.setData({
      inputValue: '',
    })
  },

  bindCancelSearch: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  bindSearch: function (e) {
    console.log(e);
    console.log(this.data.inputValue);
    wx.showLoading({
      title: '玩命加载中',
    })
    var searchRecord = wx.getStorageSync('searchRecord') || [];
    var flag = 0;
    for (var i = 0; i < searchRecord.length;i ++) {
      if (this.data.inputValue == searchRecord[i]) {
        flag = 1;
        break;
      }
    }
    if(flag == 0) {
      searchRecord.unshift(this.data.inputValue)
      wx.setStorageSync('searchRecord', searchRecord)
    }
    
    var that = this;
    $.post(
      'fyapiprj/webService/article/searchList?q=' + this.data.inputValue + '&pageNo=' + this.data.pageNo + '&pageSize=' + this.data.pageSize + '&type=' + this.data.searchType + '&mode=' + this.data.searchMode,
      {},
      function (res) {
        console.log(res.data.data);
        var searchResault = res.data.data.searchResult.data;
        if (searchResault.length != 0) {
          for (var i = 0; i < searchResault.length; i++) {
            searchResault[i].content = searchResault[i].content.substring(0, 27);
          }
          that.setData({
            searchResault: searchResault,
            resaultNumber: res.data.data.wikiTotalNum + res.data.data.subjectTotalNum,
            artcleNum: res.data.data.wikiTotalNum,
            subjectNum: res.data.data.subjectTotalNum,
            hasnoResault: 1,
          });
          wx.hideLoading();
        } else {
          // 没搜索到结果

          if (res.data.data.recommendResults.length != 0) {
            for (var i = 0; i < res.data.data.recommendResults.length; i++) {
              res.data.data.recommendResults[i].content = res.data.data.recommendResults[i].content.substring(0, 27);
            }
            that.setData({
              hasnoResault: -1,
              recommendResults: res.data.data.recommendResults,
            });            
          }
          wx.hideLoading();
        }
      }
    )
  },

  bindClearHistory: function (e) {
    var that = this;
    wx.showModal({
      title: '皇上，请三思！',
      content: '您将清空所有搜搜记录',
      cancelText: '朕再想想',
      cancelColor: '#FFD900',
      confirmText: '朕意已决',
      confirmColor: '#000000',


      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.setStorageSync('searchRecord', []);
          wx.showToast({
            title: '已清除',
            icon:'success',
          })
          that.setData({
            searchRecord: null,
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindChangeType: function (e) {
    this.setData({
      resaultType: e.currentTarget.dataset.typeid,
    });
  },

  bindArticle: function (e) {
    var article_type = e.currentTarget.dataset.type_id;
    var article_id = e.currentTarget.dataset.article_id;
    if (article_type == 0) {
      // 文章
      wx.navigateTo({
        url: '../../home/article/article?article_id=' + article_id,
      })
    } else if (article_type == 1) {
      wx.navigateTo({
        url: '../../special/list/list?special_id=' + article_id,
      })
    }
  },

  bindSpan: function(e) {
    var content = e.currentTarget.dataset.content;
    this.setData({
      inputValue: content,
    });
    this.bindSearch();
  }
})