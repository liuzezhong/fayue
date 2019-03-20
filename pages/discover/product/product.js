// pages/discover/product/product.js
import $ from '../../../common/common.js';
import qqVideo from '../../../utils/qqVideo.js';
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityitemid: 1,
    productInfo: null,
    voteState: 0,
    isLogin: false,
    skipuser: 0,
    videUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.activityitemid) {
      this.setData({
        activityitemid: options.activityitemid,
      });
    }
    if (options.skipuser) {
      that.setData({
        skipuser: options.skipuser,
      });
    }
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
    if (wx.getStorageSync('authorization') == true) {
      this.setData({
        isLogin: true,
      })
    } else {
      this.setData({
        isLogin: false,
      });
    }
    if (wx.getStorageSync('authorization') == true) {
      $.post(
        'fyapiprj/webService/voteActivity/getVoteActivityItem', {
          activityItemId: that.data.activityitemid,
          skey: wx.getStorageSync('skey'),
        },
        function(res) {
          console.log(res.data);
          if (res.data.state == 0) {
            console.log(res.data);
            var pageArr = new Array();
            var part_urls = {};

            if (res.data.data.item.urlid) {
              var vid = res.data.data.item.urlid;
            } else {
              var vid = 'c0661lh5to9';
            }
            console.log(vid);
            qqVideo.getVideoes(vid).then(function(response) {
              if (response.length != 0) {
                for (var i = 1; i < response.length + 1; i++) {
                  var indexStr = 'index' + (i)
                  pageArr.push(i);
                  part_urls[indexStr] = response[i - 1];
                }
                console.log(response);
                that.setData({
                  productInfo: res.data.data.item,
                  voteState: res.data.data.voteState,
                  videUrl: response[0],
                })
              } else {
                that.setData({
                  productInfo: res.data.data.item,
                  voteState: res.data.data.voteState,
                })
              }
            })
          }
        }
      )
    } else {
      $.post(
        'fyapiprj/webService/voteActivity/getVoteActivityItem', {
          activityItemId: that.data.activityitemid,
          skey: 0,
        },
        function(res) {
          console.log(res.data);
          if (res.data.state == 0) {
            console.log(res.data);
            var pageArr = new Array();
            var part_urls = {};
            // const vid = res.data.data.item.url;
            if (res.data.data.item.urlid) {
              var vid = res.data.data.item.urlid;
            } else {
              var vid = 'c0661lh5to9';
            }
            console.log(vid);
            qqVideo.getVideoes(vid).then(function(response) {
              if (response.length != 0) {
                for (var i = 1; i < response.length + 1; i++) {
                  var indexStr = 'index' + (i)
                  pageArr.push(i);
                  part_urls[indexStr] = response[i - 1];
                }
                console.log(response);
                that.setData({
                  productInfo: res.data.data.item,
                  voteState: res.data.data.voteState,
                  videUrl: response[0],
                })
              } else {
                that.setData({
                  productInfo: res.data.data.item,
                  voteState: res.data.data.voteState,
                })
              }
            })
          }
        }
      )
    }

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '我是' + this.data.productInfo.authorName + ',请您帮我投一票',
      path: 'pages/discover/product/product?activityitemid=' + this.data.activityitemid + '&skipuser=1',
      success: function(e) {

      },
    }
  },

  getUserInfo: function(e) {
    var userInfo = e.detail.userInfo;
    var that = this;

    $.post(
      'fyapiprj/webService/member/add',
      {
        skey: wx.getStorageSync('skey'),
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
      },
      function (res) {
        if (res.data.state == 0) {
          wx.showToast({
            title: '微信授权成功',
            icon: 'none',
            success: function () {
              wx.setStorageSync('authorization', true)
              wx.setStorageSync('userInfo', res.data.data);
              that.onReady();
            }
          })
        } else {
          wx.showToast({
            title: res.data.fieldErrors.message,
            icon: 'none'
          })
        }
      }
    )

  },

  bindDetail: function(e) {
    wx.reLaunch({
      url: '/pages/discover/detail/detail?activityid=' + this.data.productInfo.activityId,
    })
  },

  bindIndex: function(e) {
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  },

  bindVote: function(e) {
    if (wx.getStorageSync('authorization') == false) {
      wx.showToast({
        title: '请使用微信授权登录',
        icon: 'none',
        success(res) {
          setTimeout(function() {
            wx.switchTab({
              url: '../../mine/index/index?onshow=1',
            });
          }, 2000);
        }
      })
    } else {
      var that = this;
      $.post(
        'fyapiprj/webService/voteActivity/vote', {
          activityItemId: this.data.activityitemid,
          skey: wx.getStorageSync('skey'),
        },
        function(res) {
          if (res.data.state == 0) {
            if (res.data.data.state == 1) {
              // 投票成功
              wx.showToast({
                title: '投票成功',
                icon: 'success',
              });
              var productInfo = that.data.productInfo;
              productInfo.voteNum = productInfo.voteNum + 1;

              that.setData({
                voteState: 1,
                productInfo: productInfo,
              })
              wx.setStorageSync('voteactivityitemid', that.data.activityitemid);
            } else {
              wx.showToast({
                title: '投票失败，请稍后再试',
                icon: 'none',
              });
            }
          } else if (res.data.state == -1) {
            console.log(res.data);
            wx.showToast({
              title: res.data.fieldErrors[0].message,
              icon: 'none',
            });
          }
        }
      )
    }
  }
})