// pages/discover/expense/index/index.js
import $ from '../../../../common/common.js';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMember: 0, // 活动参与人数
    isJoined: 1, //是否参加活动
    hasUserInfo: false, // 是否登录
    clickLogin: 0,  // 点击免费领取
    hasUserInfoBtn: false, // 授权按钮
    existPhone: 0, // 是否存在手机号
    existPhoneBtn: false,
    pageBackgroundColor: '#ffffff', // 背景颜色
    userInfo: null,
    contentArray: null,
    lvdouappid: 'wx586501a5b03c99be',
    datiappid: 'wx5e872ff3403ad936',
    skey: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }
    this.setData({
      skey: wx.getStorageSync('skey'),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    // 微信基本信息
    if (wx.getStorageSync('authorization') == true) {
      this.setData({
        hasUserInfo: true,
      })
    } else {
      this.setData({
        hasUserInfo: false,
      });
    }
    // 判断是否授权手机号码
    $.post(
      'fyapiprj/webService/member/existsPhoneNumber', {
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/member/existsPhoneNumber');
        console.log(res);
        if(res.data.data == 1) {
          that.setData({
            existPhone: 1,
            existPhoneBtn: true,
          });
        }
      }
    )

    // 判断参加活动人数
    $.post(
      'fyapiprj/webService/rightsActivity/count/member', {
        activityId: 1,
      },
      function (res) {
        console.log(res);
        that.setData({
          totalMember: res.data.data,
        });
      }
    )

    // 判断是否参加活动
    $.post(
      'fyapiprj/webService/rightsActivity/isExist/member', {
        activityId: 1,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/isExist/member');
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            isJoined: 1,
            pageBackgroundColor: '#FFFFFF'
          });
          wx.setNavigationBarTitle({
            title: '个人中心'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF5D32',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
        } else if (res.data.state == -1) {
          that.setData({
            isJoined: 0,
            pageBackgroundColor: '#ff5426'
          });
          wx.setNavigationBarTitle({
            title: '领取消费保障金'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF5426',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
        }
      }
    )

    // 获取用户信息包含保障金
    $.post(
      'fyapiprj/webService/rightsActivity/get/member', {
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/get/member');
        console.log(res);
        if(res.data.data.length != 0) {
          that.setData({
            userInfo: res.data.data,
          });
        }
      }
    )

    //获取轮播图
    $.post(
      'fyapiprj/webService/rightsActivity/get/rightsCarousel', {
        region: 1, // 成功页面
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/get/rightsCarousel');
        console.log(res.data);
        if (res.data.data.length != 0) {
          that.setData({
            contentArray: res.data.data,
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

  // 点击免费领取按钮
  bindReceive: function () {
    if (this.data.hasUserInfo == false) {
      // 未登录
      console.log('未登录');
      this.setData({
        clickLogin: 1,
      });
    } else {
      // 已登录
      console.log('已登录');
      // 参加活动
      this.receiveMoney();
    }
  },

  // 参加活动
  receiveMoney: function () {
    console.log('receiveMoney:skey=' + wx.getStorageSync('skey'));
    $.post(
      'fyapiprj/webService/rightsActivity/ownJoin', {
        activityId: 1,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log(res);
        if(res.data.state == 0) {
          wx.navigateTo({
            url: '../success/success?type=1',
          })
        } else if(res.data.state == -1) {
          wx.showToast({
            title: '您已成功领取',
            icon: 'none',
            success: function() {
              setTimeout(function(){
                wx.redirectTo({
                  url: '../index/index',
                })
              },2000);  
            }
          })
        }

        // 参加成功后跳转页面
        // type=1 参加活动的结果页，type=2 提交申请结果页
        
      }
    )
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    var that = this;
    wx.showLoading({
      title: '授权中……',
    })
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
        console.log(res);
        if (res.data.state == 0) {
          wx.showToast({
            title: '用户信息授权成功',
            icon: 'none',
            success: function () {
              wx.setStorageSync('authorization', true);
              wx.setStorageSync('userInfo', res.data.data);
              that.setData({
                hasUserInfoBtn: true,
              });
            }
          })
          
        } else {
          wx.showToast({
            title: res.data.fieldErrors.message,
            icon: 'none'
          })
        }
        wx.hideLoading();
      }
    )
  },

  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
  
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            // 登录成功
            var iv = e.detail.iv;
            var code = res.code;
            var encryptedData = e.detail.encryptedData;
            wx.showLoading({
              title: '授权中……',
            })
            $.post(
              'fyapiprj/webService/member/getPhoneNumber', {
                iv: iv,
                encryptedData: encryptedData,
                skey: wx.getStorageSync('skey'),
                code: code,
              },
              function (res) {
                console.log(res);
                if (res.data.state == 0) {
                  if (res.data.data == 0) {
                    wx.showToast({
                      title: '手机号授权失败',
                      icon: 'none',
                    })
                  } else if (res.data.data == 1) {
                    wx.showToast({
                      title: '手机号授权成功',
                      icon: 'none',
                      success: function () {
                        setTimeout(function () {
                          that.setData({
                            existPhoneBtn: true,
                          });
                        }, 1500);
                      }
                    })
                  }
                }
              }
            )
            wx.hideLoading();
          }
        }
      })
    }
  },

  bindCloseBullet: function () {
    this.setData({
      clickLogin: 0,
    });
  },

  bindNextStep: function() {
    this.setData({
      clickLogin: 0,
      hasUserInfo:true,
    });
    this.receiveMoney();
  },

  bindApply: function() {
    wx.navigateTo({
      url: '../info/info',
    })
  },

  bindArticle: function (e) {
    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../home/article/article?article_id=' + article_id,
    })
  },

  bindSubjectList: function (e) {
    // 跳转专题列表页
    var special_id = e.currentTarget.dataset.subid;
    console.log(special_id);
    wx.navigateTo({
      url: '../../../special/list/list?special_id=' + special_id,
    })
  },

  bindRecord: function(e) {
    wx.navigateTo({
      url: '../record/record',
    })
  },

  bindRule: function(e) {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },

  bindIndex: function() {
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  }
})