// pages/discover/expense/invite/invite.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentSkey: null,
    parentUserInfo: null,
    totalMember: 0, // 总参加人数
    hasUserInfo: false, // 是否登录
    clickLogin: 0,  // 点击免费领取
    hasUserInfoBtn: false, // 授权按钮
    existPhone: 0, // 是否存在手机号
    existPhoneBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }

    if(options.skey) {
      this.setData({
        parentSkey: options.skey,
      });
    }
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
    //判断是否参加活动
    $.post(
      'fyapiprj/webService/rightsActivity/isExist/member', {
        activityId: 1,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/isExist/member');
        console.log(res);
        if (res.data.state == 0) {
          // 已参加活动
          wx.showToast({
            title: '您已领取，正在前往个人中心……',
            icon: 'none',
            success(res) {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../index/index',
                })
              },3000);
            }
          })
          
        }
      }
    )

    // 查询邀请人信息
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
        if (res.data.data == 1) {
          that.setData({
            existPhone: 1,
            existPhoneBtn: true,
          });
        }
      }
    )


    if (this.data.parentSkey != null) {
      $.post(
        'fyapiprj/webService/rightsActivity/get/member', {
          skey: this.data.parentSkey,
        },
        function (res) {
          console.log('fyapiprj/webService/rightsActivity/get/member');
          console.log(res);
          if (res.data.data.length != 0) {
            that.setData({
              parentUserInfo: res.data.data,
            });
          }
        }
      )
    }else {
      wx.showToast({
        title: '邀请人信息获取失败',
        icon: 'none',
      })
    }
    

    // 统计活动人数
    $.post(
      'fyapiprj/webService/rightsActivity/count/member', {
        activityId: 1,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/count/member');
        console.log(res);
        if (res.data.data != -1) {
          that.setData({
            totalMember: res.data.data,
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

  bindRules: function() {
    wx.navigateTo({
      url: '../rule/rule',
    })
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
      'fyapiprj/webService/rightsActivity/shareJoin', {
        activityId: 1,
        skey: wx.getStorageSync('skey'),
        parentSkey: this.data.parentSkey,
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          wx.navigateTo({
            url: '../success/success?type=1',
          })
        } else if (res.data.state == -1) {
          wx.showToast({
            title: '你已经领过啦，分享给别人吧~',
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../index/index',
                })
              }, 2000);
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

  bindNextStep: function () {
    this.setData({
      clickLogin: 0,
      hasUserInfo: true,
    });
    this.receiveMoney();
  },

  bindIndex: function () {
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  }
})