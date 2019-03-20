// pages/discover/energy/energy.js
import $ from '../../../common/common.js';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    awardId: 17,
    awardInfo: null,
    selectAward: null,
    give: 0,
    isSelf: 1,
    collect: 0,
    collectEnergy: 0,
    selectId: 1,
    forwarding: 0, // 是否转发打开，0为页面打开，1为转发后打开
    isLogin: false,
    activityRuleId: 0,
    giveEnergy: 0,
    strategyPop:0,
    lawContent: '宪法，就是一张写着人民权利的纸。',
    lawAuthor: '列宁',
    addEnergy: 0,
    powerList: null,
    powerNum: 0,
    isChecked: 0,
    hasPhone: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }

    var that =this;
    if (options.selectId) {
      this.setData({
        'selectId': options.selectId,
      });
    }

    if (options.scene) {
      this.setData({
        'selectId': options.scene,
        'forwarding': 1,
      });
    }

    if (options.forwarding) {
      that.setData({
        'forwarding': options.forwarding,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var thats = this;
    var thatss = this;

    if (wx.getStorageSync('authorization') == true) {
      var skey = wx.getStorageSync('skey');
      this.setData({
        isLogin: true,
      });
    } else if (wx.getStorageSync('authorization') == false) {
      var skey = '';
      this.setData({
        isLogin: false,
      });
    }

    $.post(
      'fyapiprj/webService/energy/energyInfo',
      {
        id: this.data.selectId,
        skey: skey,
      },
      function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          that.setData({
            awardInfo: res.data.data.award,
            selectAward: res.data.data.selectAward,
            give: res.data.data.give,
            isSelf: res.data.data.isSelf,
            collect: res.data.data.collect,
            collectEnergy: res.data.data.collectEnergy,
            activityRuleId: res.data.data.activityRuleId,
            giveEnergy: res.data.data.giveEnergy,
            lawContent: res.data.data.myjj.my,
          });
          if (res.data.data.myjj) {
            that.setData({
              activityInfo: res.data.data,
              lawContent: res.data.data.myjj.my,
              lawAuthor: res.data.data.myjj.zz,
            });
          }

          $.post(
            'fyapiprj/webService/member/existsPhoneNumber', {
              skey: wx.getStorageSync('skey'),
            },
            function (res) {
              if (res.data.state == 0) {
                if (res.data.data == 0) {
                  // 没有手机号
                  thatss.setData({
                    hasPhone: 0,
                  });
                } else {
                  // 有手机号
                  thatss.setData({
                    hasPhone: 1,
                  });
                }
              }
            }
          )

        } else {
          wx.showToast({
            title: '能量信息加载失败',
            icon: 'none',
          })
        }
        wx.hideLoading();
      }
    )

    $.post(
      'fyapiprj/webService/energy/energyRecord',
      {
        id: this.data.selectId,
        pageNo: 1,
        pageSize: 5,
      },
      function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          if(res.data.data) {
            thats.setData({
              powerList: res.data.data.energyRecord,
              powerNum: res.data.data.totalElements,
            });
          }
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我正在参与圣诞心愿活动，快来帮我集能量~',
      path: 'pages/discover/energy/energy?selectId=' + this.data.selectId + '&forwarding=1',
      success: function (e) {
        
      },
    }
    console.log('转发成功');
  },

  bindEnergy: function(e) {
    var that = this;
    
    if(this.data.isChecked == 0) {
      this.setData({
        isChecked: 1,
      });
      $.post(
        'fyapiprj/webService/energy/collectEnergy',
        {
          id: this.data.selectId,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          console.log(res.data);
          if (res.data.state == 0) {
            if (res.data.data.collectState == 1) {
              wx.showToast({
                title: '能量值+' + that.data.collectEnergy,
                icon: 'none',
              })
              setTimeout(function () {
                that.setData({
                  addEnergy: 1,
                });
                that.onReady();
              }, 1500);
            }
          } else {
            wx.showToast({
              title: '今天已经收取过啦！',
              icon: 'none',
            })
          }
        }
      )
    } else {
      wx.showToast({
        title: '您点的太快了，稍后再试！',
        icon: 'none',
      })
    }
    
  },

  bindOtherEnergy: function (e) {
    var that = this;
    console.log('bindOtherEnergy');

    console.log(this.data.isLogin);
    console.log(this.data.hasPhone);
    if (this.data.isLogin == false) {
      wx.showToast({
        title: '请点击给TA能量按钮授权信息',
        icon:'none',
      })
    }else {

      if (this.data.hasPhone == 0) {
        wx.showToast({
          title: '请点击给TA能量按钮授权手机号码',
          icon: 'none',
        })
      }else {
        if (this.data.isChecked == 0) {
          this.setData({
            isChecked: 1,
          });
          $.post(
            'fyapiprj/webService/energy/giveEnergy',
            {
              id: this.data.selectId,
              skey: wx.getStorageSync('skey')
            },
            function (res) {
              console.log(res.data);
              if (res.data.state == 0) {
                if (res.data.data == 1) {
                  wx.showToast({
                    title: '成功助力' + that.data.giveEnergy + '能量值',
                    icon: 'none',
                  })
                  setTimeout(function () {
                    that.setData({
                      addEnergy: 1,
                    });
                    that.onReady();
                  }, 1500);
                }
              } else {
                wx.showToast({
                  title: '加载错误',
                  icon: 'none',
                })
              }
            }
          )
        } else {
          wx.showToast({
            title: '您点的太快了，稍后再试！',
            icon: 'none',
          })
        } 
      }
    }
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
  
  bindChangePopshow: function(e) {
    this.setData({
      strategyPop: 1,
    });
  },

  bindChangePopup: function(e) {
    this.setData({
      strategyPop: 0,
    });
  },

  getPhoneNumber: function (e) {
    var that = this;
    var thats = this;
    console.log('getPhoneNumber');
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '请授权您的手机号',
        icon: 'none',
      })
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            // 登录成功
            console.log(res.code);
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
                console.log('手机号：');
                console.log(res);
                if (res.data.state == 0) {
                  if (res.data.data == 0 || res.data.data == 2) {
                    wx.showToast({
                      title: '手机号授权失败，请重试',
                      icon: 'none',
                    })
                    that.bindOtherEnergy();
                  } else if (res.data.data == 1) {
                    wx.showToast({
                      title: '手机号授权成功',
                      icon: 'none',
                      success: function () {
                        setTimeout(function () {
                          thats.setData({
                            hasPhone: 1,
                          });
                          that.bindOtherEnergy();
                        }, 1500);
                      }
                    })
                  }
                } else {
                  wx.showToast({
                    title: '加载失败',
                    icon: 'none',
                  })
                }
              }
            )
          } else {
            console.log('登录失败' + res.errMsg)
          }
        }
      })
    }
  },
})