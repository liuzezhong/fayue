// pages/discover/expense/run/run.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scopeRun: true, // 同意授权
    runArray: null,
    sumMoney: 0,
    tomroorwStep: 0,
    isScopeWerun: 1,
    exchangeSuccess: false,
    isExchange: false, //已经领取
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        // 返回已经请求过的权限
        console.log(res);
        if (res.authSetting['scope.werun']) {
          // 已经授权
          that.setData({
            isScopeWerun: 1,
          });
          that.getRunDecodeData();
        } else {
          that.setData({
            isScopeWerun: 0,
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 判断是否已经兑换保障金
    $.post(
      'fyapiprj/webService/rightsActivity/has/exchange', {
        paymentType: 2,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/has/exchange');
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            isExchange: true,
          });
        }
      }
    )

    // 获取累计兑换保障金额
    $.post(
      'fyapiprj/webService/rightsActivity/sum/paymentAmount', {
        skey: wx.getStorageSync('skey'),
        type: 0, // 收支类型，0收入，1支出
        paymentType: 2, // 	类型说明：0初始，1答题，2步数兑换，3分享；10报销
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/sum/paymentAmount');
        console.log(res);
        if (res.data.data) {
          that.setData({
            sumMoney: res.data.data,
          });
        }
      }
    )

    // 获取兑换记录
    $.post(
      'fyapiprj/webService/rightsActivity/page/amountRecord', {
        skey: wx.getStorageSync('skey'),
        type: 0, // 收支类型，0收入，1支出
        paymentType: 2, // 	类型说明：0初始，1答题，2步数兑换，3分享；10报销
        pageNo: 1,
        pageSize: 1000,
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/page/amountRecord');
        console.log(res);
        if (res.data.data.length != 0) {
          that.setData({
            runArray: res.data.data,
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
    console.log(this.data.userInfo);
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    var that = this;
    $.post(
      'fyapiprj/webService/rightsActivity/run/share',
      {
        activityId: 1,
        skey: that.data.paperId,
      },
      function (res) {
        console.log('***********');
        console.log('fyapiprj/webService/rightsActivity/run/share');
        console.log(res);
        if (res.data.state == 0) {
          wx.showToast({
            title: '消费基金+100',
            icon: 'none'
          })
          that.setData({
            exchangeSuccess: false,
          });
        } else if (res.data.state == -1) {
          wx.showToast({
            title: '转发失败',
            icon: 'none'
          })
        }
      }
    )
    return {
      title: '送您315元消费维权保障金，点击立即领取',
      path: '/pages/discover/expense/invite/invite?skey=' + wx.getStorageSync('skey'),
      imageUrl: 'http://imgbj.xianshikeji.com/315zhuanfa.jpg',
      success: function () {

      },
      fail: function () {

      }
    }


  },
  bindRule: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },

  getRunDecodeData: function () {
    var that = this;
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        const iv = res.iv
        that.setData({
          isScopeWerun: 1
        });
        wx.login({
          success(res) {
            if (res.code) {
              // 登录成功
              var code = res.code;
              console.log(encodeURIComponent(encryptedData));
              // console.log(encryptedData);
              console.log(iv);
              console.log(code);
              $.post(
                'fyapiprj/webService/rightsActivity/decode/wxData', {
                  iv: iv,
                  encryptedData: encryptedData,
                  skey: wx.getStorageSync('skey'),
                  code: code,
                },
                function (res) {
                  console.log('fyapiprj/webService/rightsActivity/decode/wxData');
                  console.log(res);
                  if (res.data.state == 0) {
                    that.setData({
                      tomroorwStep: res.data.data.step,
                    });
                  } else if (res.data.state == -1) {
                    wx.showToast({
                      title: '微信步数获取失败',
                      icon: 'none'
                    })
                  }
                }
              )
            }
          }
        })
      },
      fail(res) {
        wx.setStorageSync('scopeRun', false)
      }
    })
  },

  getRunData: function () {
    var that = this;

    wx.getSetting({
      success(res) {
        // 返回已经请求过的权限
        console.log(res);
        if (!res.authSetting['scope.werun']) {
          console.log('if');
          console.log(res.authSetting['scope.werun']);
          if (wx.getStorageSync('scopeRun') == true) {
            // 用户未拒绝授权过
            that.getRunDecodeData();
          } else if (wx.getStorageSync('scopeRun') == false) {
            // 用户拒绝了授权
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
              }
            })
          }
        } else {
          console.log('else');
          console.log(res.authSetting['scope.werun']);
          that.getRunDecodeData();
        }
      }
    })
  },

  bindExchange: function () {
    var that = this;
    $.post(
      'fyapiprj/webService/rightsActivity/add/amount', {
        activityId: 1,
        paymentType: 2,
        skey: wx.getStorageSync('skey'),
        paymentAmount: 100,
        paymentDescription: '步数兑换'
      },
      function (res) {
        console.log('fyapiprj/webService/rightsActivity/add/amount');
        console.log(res);
        if (res.data.state == 0) {
          that.setData({
            exchangeSuccess: true,
          });
        } else if (res.data.state == -1) {
          wx.showToast({
            title: '微信步数兑换失败',
            icon: 'none',
          })
        }
      }
    )
  },

  bindCloseBullet: function () {
    this.setData({
      exchangeSuccess: false,
    });
  },

  bindIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})