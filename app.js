//app.js
const ald = require('./utils/ald-stat.js')
var pushApp = require('./utils/pushsdk.js').pushSdk()
import $ from 'common/common.js';
App({
  onLaunch: function (res) {
    var that = this;
    var thats = this;
    wx.setStorageSync('scopeRun', true)
    /**
     * 检查版本更新
     */
    this.updataApp();
    // const updateManager = wx.getUpdateManager()
    // updateManager.onUpdateReady(function () {
    //   // 显示模态对话框
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success(res) {
    //       if (res.confirm) {
    //         // 清空缓存
    //         wx.clearStorage();
    //         // 调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       } else if (res.cancel) {
    //         // 清空缓存
    //         wx.clearStorage();
    //         // 调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       }
    //     },
    //   })
    // })

    /**
     * 检查登录信息
     */

    // 获取skey
    let loginFlag = wx.getStorageSync('skey');
    if(loginFlag) {
      // 存在skey(已登录)，检验登录态是否存在
      wx.checkSession({
        success: function (res) {
          // 登录态有效，判断是skey是否正确
          
          // skey不正确或不存在，重新登录
        },
        fail: function (res) {
          // 登录态过期，重新的登录
          thats.wxLogin();
        }
      });
    }else {
      // 不存在skey（未登录），调用wxlogin登录
      thats.wxLogin();
    }
    
    /**
     * 获取用户信息
     */

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.setStorageSync('authorization', true)
          // 更新用户信息
          that.wxGetUserInfo();
        }else {
          // 未授权，设置授权状态
          wx.setStorageSync('authorization', false)
        }
      }
    })
  },

  /**
   * 微信登录，换取skey
   */
  wxLogin: function(res) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this;
        $.post(
          'fyapiprj/webService/member/toGetOpenId',
          { 
            code: res.code
          },
          function (res) {
            // 写入缓存
            wx.setStorageSync('skey', res.data.data)
          }
        )
      }
    })
  },

  /**
   * 授权微信信息
   */
  wxGetUserInfo: function(res) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo;
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
            if(res.data.data == -2) {
              // 数据库中skey不存在,强制更新
              that.wxLogin();
              wx.showToast({
                title: res.data.fieldErrors.message,
                icon: 'none'
              })
            }else {
              wx.setStorageSync('userInfo', res.data.data);
            }
            
          }
        )
      }
    })
  },

  updataApp: function () {//版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) { // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  wx.clearStorage();
                  updateManager.applyUpdate();
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({// 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  globalData: {
    userInfo: null,
  }
})