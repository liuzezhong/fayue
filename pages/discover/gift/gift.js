// pages/discover/gift/gift.js
import $ from '../../../common/common.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 100,
    activityId: 7,
    awardList: null,
    activityEnd:false,
    showSureToast: false,
    chooseAwardId: 0,
    activityState: 0,// 活动状态，1进行中 2已经结束  9删除  0时间到了
    memberChoose: null,
    floorstatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.activityId) {
      this.setData({
        activityId: options.activityId,
      });
    }else {
      wx.showToast({
        title: '活动不存在',
        icon:'none',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })

    $.post(
      'fyapiprj/webService/energy/listAward',
      {
        activityId: this.data.activityId,
        skey: wx.getStorageSync('skey'),
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          console.log(res.data.data.awardList);
          that.setData({
            awardList: res.data.data.awardList,
            activityState: res.data.data.activityState,
          });
          if (res.data.data.memberChoose) {
            that.setData({
              memberChoose: res.data.data.memberChoose,
            });
          }
        } else {
          wx.showToast({
            title: '加载错误',
            icon: 'none',
          })
        }
        wx.hideLoading();
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

  },
  
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  // 选择礼物
  bindChooseAward: function(e) {
    console.log(e);
    var that = this;
    var awardId = this.data.chooseAwardId;
    if(awardId == 0) {
      wx.showToast({
        title: '礼物不存在',
        icon: 'icon',
      })
    }else {
      // 请求
      wx.showLoading({
        title: '玩命加载中',
      })
      console.log('acktivityID:' + this.data.activityId);
      console.log('skey:' + wx.getStorageSync('skey'));
      console.log('awardId:' + awardId);
      $.post(
        'fyapiprj/webService/energy/chooseAward',
        {
          activityId: this.data.activityId,
          skey: wx.getStorageSync('skey'),
          awardId: awardId,
        },
        function (res) {
          console.log(res.data);
          if (res.data.state == 0) {
            if(res.data.data != 0) {
              wx.showToast({
                title: '选择成功',
                icon: 'none',
                success: function() {
                  that.setData({
                    showSureToast: false,
                  });
                  wx.navigateTo({
                    url: '../energy/energy?selectId=' + res.data.data,
                  })
                }
              })
            } else if (res.data.data == 2) {
              wx.showToast({
                title: '每人只能选一件礼物',
                icon: 'none',
                success: function() {
                  that.setData({
                    showSureToast: false,
                  });
                }
              })
            } else if (res.data.data == -1 || res.data.data == 0) {
              wx.showToast({
                title: '选择失败',
                icon: 'none',
                success: function () {
                  that.setData({
                    showSureToast: false,
                  });
                }
              })
            }
          } else {
            wx.showToast({
              title: '礼物已被领完',
              icon: 'none',
            })
          }
          wx.hideLoading();
        }
      )
    }
  },
  
  // 确认选择
  bindSureChoose: function(e) {

    var awardId = e.currentTarget.dataset.id;

    if (this.data.activityState == 0) {
      // 活动已结束，进入结果页
      wx.navigateTo({
        url: '../winner/winner?awardId=' + awardId,
      })
    } else if (this.data.activityState == 1) {
      // 活动进行中
      if (this.data.memberChoose) {
        // 用户有选择过
        if(awardId == this.data.memberChoose.awardId) {
          // 点击的是选中的奖品
          wx.navigateTo({
            url: '../energy/energy?selectId=' + this.data.memberChoose.id,
          })
        } else if (awardId != this.data.memberChoose.awardId) {
          // 点击的不是选中的奖品
          var awardList = this.data.awardList;
          var flag = 0;
          for (var i = 0; i < awardList.length; i++) {
            if (awardId == awardList[i].awardId) {
              console.log('find');
              if (awardList[i].userNumber == 0) {
                flag = 1;
              }
              break;
            }
          }

          if(flag == 0){
            wx.navigateTo({
              url: '../wishlist/wishlist?activityid=' + this.data.activityId + '&awardId=' + awardId,
            })
          } else if (flag == 1){
            wx.showToast({
              title: '暂未有人许愿',
              icon:'none'
            })
          }

          
        }
      } else {
        // 没选择过，首次弹窗提示
        console.log(e);
        this.setData({
          'chooseAwardId': awardId,
          'showSureToast': true,
        });
      }
    }
    
    
  },

  bindChangePopup: function(e) {
    console.log(e);
    this.setData({
      'showSureToast': false,
    });
  },

  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})