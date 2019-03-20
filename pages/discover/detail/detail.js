// pages/discover/detail/detail.js
import $ from '../../../common/common.js';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityid: 7,
    activityInfo: null,
    countDAY: '00',
    countHour: '00',
    countMinute: '00',
    countSecond: '00',
    searchInput: '',
    pageNo: 1,
    pageSize: 100,
    productList: null,
    activityType: 1, // 1为投票活动 2为圣诞节活动
    hasPhone: 0, // 0为没有号码，1为有号码
    isLogin: false,
    selectAward: null,
    sharemarks: 0,
    lawContent: '宪法，就是一张写着人民权利的纸。',
    lawAuthor: '列宁',
    addEnergy: 0,
    powerList: null,
    powerNum: 0,
    isChecked:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }
    if (options.activityid) {
      this.setData({
        activityid: options.activityid,
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
    var that = this;
    var thats = this;
    var thatss = this;
    var thatsss = this;
    if (wx.getStorageSync('authorization') == true) {
      var skey = wx.getStorageSync('skey');
      this.setData({
        isLogin: true,
      })
    } else {
      appInstance.wxLogin();
      this.setData({
        isLogin: false,
      });
    }

    console.log('skey:' + skey);
    console.log('activityId:' + this.data.activityid);
    $.post(
      'fyapiprj/webService/voteActivity/getVoteActivity', {
        activityId: this.data.activityid,
        skey: wx.getStorageSync('skey'),
      },
      function (res) {
        if (res.data.state == 0) {
          console.log(res.data.data);
          that.setData({
            activityInfo: res.data.data,
          });

          if (res.data.data.type == 1) {
            $.post(
              'fyapiprj/webService/voteActivity/listVoteActivityItem', {
                activityId: that.data.activityid,
                pageNo: that.data.pageNo,
                pageSize: that.data.pageSize,
                query: that.data.searchInput,
                skey: wx.getStorageSync('skey'),
              },
              function (res) {
                if (res.data.state == 0) {
                  console.log(res.data.data);
                  if (res.data.data.length != 0) {
                    thatss.setData({
                      productList: res.data.data,
                    });
                  }
                }
              }
            )
          } else if (res.data.data.type == 2) {
            if (res.data.data.myjj) {
              that.setData({
                activityInfo: res.data.data,
                lawContent: res.data.data.myjj.my,
                lawAuthor: res.data.data.myjj.zz,
              });

              if (res.data.data.selectAward) {
                console.log('id=' + res.data.data.selectAward.id);
                $.post(
                  'fyapiprj/webService/energy/energyRecord',
                  {
                    id: res.data.data.selectAward.id,
                    pageNo: 1,
                    pageSize: 5,
                  },
                  function (res) {
                    console.log('power');
                    console.log(res.data);
                    if (res.data.state == 0) {
                      if (res.data.data) {
                        thatsss.setData({
                          powerList: res.data.data.energyRecord,
                          powerNum: res.data.data.totalElements,
                        });
                      }
                    }
                  }
                )
              }
            }

            $.post(
              'fyapiprj/webService/member/existsPhoneNumber', {
                skey: wx.getStorageSync('skey'),
              },
              function (res) {
                if (res.data.state == 0) {
                  if (res.data.data == 0) {
                    // 没有手机号
                    thats.setData({
                      hasPhone: 0,
                    });
                  } else {
                    // 有手机号
                    thats.setData({
                      hasPhone: 1,
                    });
                  }
                }
              }
            )
          }
          that.countDown();
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (wx.getStorageSync('voteactivityitemid')) {
      var productList = this.data.productList;
      if (productList != null) {
        for (var i = 0; i < productList.length; i++) {
          if (productList[i].activityItemId == wx.getStorageSync('voteactivityitemid')) {
            productList[i].voteNum = productList[i].voteNum + 1;
            productList[i].voteState = 1;
          }
        }
        this.setData({
          productList: productList,
        })
        wx.setStorageSync('voteactivityitemid', 0);
      }
    }
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
    if (this.data.activityType == 1) {

      var pageNo = this.data.pageNo + 1;
      if (wx.getStorageSync('authorization') == true) {
        var skey = wx.getStorageSync('skey');
      } else {
        var skey = 0;
      }
      $.post(
        'fyapiprj/webService/voteActivity/listVoteActivityItem', {
          activityId: this.data.activityid,
          pageNo: pageNo,
          pageSize: this.data.pageSize,
          query: this.data.searchInput,
          skey: skey,
        },
        function (res) {
          if (res.data.state == 0) {
            if (res.data.data.length != 0) {
              var oldProductList = that.data.productList;
              var newProductList = res.data.data;

              for (var i = 0; i < newProductList.length; i++) {
                oldProductList.push(newProductList[i]);
              }

              that.setData({
                productList: oldProductList,
                pageNo: pageNo,
              });
            } else {
              that.setData({
                getAllArtice: true,
              });
            }
          } else {
            wx.showToast({
              title: '加载失败，请稍后再试',
              icon: 'none',
            })
          }
        }
      )
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    if (this.data.activityInfo.isChooseAward == 1) {
      return {
        title: '我正在参与圣诞心愿活动，快来帮我集能量~',
        path: 'pages/discover/energy/energy?selectId=' + this.data.activityInfo.selectAward.id + '&forwarding=1',
        success: function (e) {

        },
      }
    } else {
      return {
        title: this.data.activityInfo.activityName + '活动正在进行，速来围观吧~',
        path: 'pages/discover/detail/detail?activityid=' + this.data.activityid,
        success: function (e) {

        },
      }
    }

  },

  countDown: function () {
    //获取当前时间  
    var nowTime = new Date();
    //设置截止时间  
    var endTime = new Date(this.data.activityInfo.endTime * 1000);
    //var endTime = new Date(1542370530 * 1000);
    //时间差  
    var leftTime = endTime.getTime() - nowTime.getTime();
    //定义变量 d,h,m,s保存倒计时的时间  
    var day, hour, minute, second;
    if (leftTime >= 0) {
      day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      hour = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      minute = Math.floor(leftTime / 1000 / 60 % 60);
      second = Math.floor(leftTime / 1000 % 60);

      if (day < 10) {
        day = '0' + day;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }

      //将倒计时赋值到div中
      this.setData({
        countDAY: day,
        countHour: hour,
        countMinute: minute,
        countSecond: second,
      });
      //递归每秒调用countTime方法，显示动态时间效果  
      setTimeout(this.countDown, 1000);
    }
  },

  bindVote: function (e) {
    var activityItemId = e.currentTarget.dataset.activityitemid;
    // 投票接口
    if (wx.getStorageSync('authorization') == false) {
      wx.showToast({
        title: '请使用微信授权登录',
        icon: 'none',
        success(res) {
          setTimeout(function () {
            wx.switchTab({
              url: '../../mine/index/index?onshow=1',
            });
          }, 2000);
        }
      })
    } else {
      var that = this;
      var productList = this.data.productList;
      $.post(
        'fyapiprj/webService/voteActivity/vote', {
          activityItemId: activityItemId,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          if (res.data.state == 0) {
            if (res.data.data.state == 1) {
              // 投票成功
              wx.showToast({
                title: '投票成功',
                icon: 'success',
              });
              for (var i = 0; i < productList.length; i++) {
                if (productList[i].activityItemId == activityItemId) {
                  productList[i].voteNum = productList[i].voteNum + 1;
                  productList[i].voteState = 1;
                }
              }
              that.setData({
                productList: productList,
              })
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

  },

  // 作品详情页
  bindProductDetail: function (e) {
    var activityItemId = e.currentTarget.dataset.activityitemid;
    wx.navigateTo({
      url: '../product/product?activityitemid = ' + activityItemId,
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },

  bindSearch: function (e) {
    console.log('activityID:' + this.data.activityid);
    console.log('query:' + this.data.searchInput);
    var that = this;
    $.post(
      'fyapiprj/webService/voteActivity/listVoteActivityItem', {
        activityId: that.data.activityid,
        pageNo: 1,
        pageSize: 100,
        query: that.data.searchInput,
      },
      function (res) {
        console.log(res);
        if (res.data.state == 0) {
          if (res.data.data.length != 0) {
            wx.showToast({
              title: '为您找到' + res.data.data.length + '个作品',
              icon: 'none',
              success: function () {
                that.setData({
                  productList: res.data.data,
                });
              }
            })
          } else {
            wx.showToast({
              title: '未找到该作品',
              icon: 'none',
            })
          }

        }
      }
    )
  },

  bindRules: function (e) {
    var activityruleid = e.currentTarget.dataset.ruleid;
    wx.navigateTo({
      url: '../rule/rule?activityruleid=' + activityruleid,
    })
  },

  bindDetail: function (e) {
    if (wx.getStorageSync('authorization') == false) {
      wx.showToast({
        title: '请使用微信授权登录',
        icon: 'none',
        success(res) {
          setTimeout(function () {
            wx.switchTab({
              url: '../../mine/index/index?onshow=1',
            });
          }, 2000);
        }
      })
    } else {
      var activityitemid = e.currentTarget.dataset.activityitemid;
      if (activityitemid) {
        wx.navigateTo({
          url: '../product/product?activityitemid=' + activityitemid,
        })
      } else {
        wx.showToast({
          title: '请稍后再试',
          icon: 'none',
        })
      }
    }

  },

  bindRank: function (e) {
    var activityid = this.data.activityid;
    wx.navigateTo({
      url: '../rank/rank?activityid=' + activityid,
    })
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

  getPhoneNumber: function (e) {
    var that = this;
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
                          that.bindGift();
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

  bindGift: function (e) {
    wx.navigateTo({
      url: '../gift/gift?activityId=' + this.data.activityid,
    })
  },

  bindShareMarks: function (e) {
    this.setData({
      sharemarks: 1,
    });
  },

  closeMarks: function (e) {
    this.setData({
      sharemarks: 0,
    });
  },

  showShareMarks: function (e) {
    this.setData({
      sharemarks: 1,
    });
  },

  previewImageShow: function (e) {
    wx.navigateTo({
      url: '../image/image?url=' + this.data.activityInfo.selectAward.cardPic,
    })
    this.setData({
      sharemarks: 0,
    });
  },

  bindEnergy: function (e) {
    var that = this;
    

    if(this.data.isChecked == 0) {
      this.setData({
        isChecked: 1,
      });
      $.post(
        'fyapiprj/webService/energy/collectEnergy',
        {
          id: this.data.activityInfo.selectAward.id,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          console.log(res.data);
          if (res.data.state == 0) {
            if (res.data.data.collectState == 1) {

              setTimeout(function () {
                wx.showToast({
                  title: '能量值+' + that.data.activityInfo.energyData.collectEnergy,
                  icon: 'none',
                  success: function () {
                    that.setData({
                      addEnergy: 1,
                    });
                    that.onReady();
                  }
                })
              }, 100);
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

})