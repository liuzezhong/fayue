// pages/discover/expense/form/form.js
import $ from '../../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    inputValue: '',
    lvdouArray: null,
    getLvdou: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  formSubmit(e) {
    var that = this;
    var formValue = e.detail.value;
    if (!formValue.mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
      })
    } else if (!formValue.orderId) {
      wx.showToast({
        title: '请输入律兜订单号',
        icon: 'none',
      })
    } else if (this.data.getLvdou == false) {
      wx.showToast({
        title: '查无此订单记录',
        icon: 'none',
      })
    }
    else if (!formValue.expenseAmount) {
      wx.showToast({
        title: '可报销金额计算失败',
        icon: 'none',
      })
    } 
    else if (!formValue.orderDescription) {
      wx.showToast({
        title: '请输入维权事件描述',
        icon: 'none',
      })
    } else {
      console.log(formValue);
      // 判断保障金是否足够
      $.post(
        'fyapiprj/webService/rightsActivity/isEnough/amount', {
          skey: wx.getStorageSync('skey'),
          expenseAmount: formValue.expenseAmount,
        },
        function (res) {
          console.log('fyapiprj/webService/rightsActivity/isEnough/amount');
          console.log(res);
          if (res.data.state == -1) {
            wx.showToast({
              title: '您的保障金额度不足',
              icon: 'none',
            })
          }else {
            // 写入记录
            $.post(
              'fyapiprj/webService/rightsActivity/add/expenseReport', {
                skey: wx.getStorageSync('skey'),
                nickname: formValue.nickname,
                mobile: formValue.mobile,
                orderId: formValue.orderId,
                orderType: formValue.orderType,
                orderAmount: formValue.orderAmount,
                expenseAmount: formValue.expenseAmount,
                orderDescription: formValue.orderDescription,
              },
              function (res) {
                console.log('fyapiprj/webService/rightsActivity/add/expenseReport');
                console.log(res);
                if (res.data.state == 0) {
                  wx.redirectTo({
                    url: '../success/success?type=2',
                  })
                } else if (res.data.state == -1) {
                  wx.showToast({
                    title: '提交失败，请稍后再试',
                    icon: 'none',
                  })
                }
              }
            )
          }
        }
      )
    }
  },

  bindKeyInput(e) {
    var that = this;
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e.detail.value);
    if(this.data.inputValue != '') {
      $.post(
        'fyapiprj/webService/rightsActivity/get/lvdou/order', {
          skey: wx.getStorageSync('skey'),
          orderId: this.data.inputValue,
        },
        function (res) {
          console.log('fyapiprj/webService/rightsActivity/get/lvdou/order');
          console.log(res);
          if(res.data.state == 0) {
            that.setData({
              lvdouArray: res.data.data,
              getLvdou: true,
            }); 
          }else {
            that.setData({
              getLvdou: false,
            }); 
          }
        }
      )
    }
  },
})