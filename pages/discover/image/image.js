// pages/discover/image/image.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://ww3.sinaimg.cn/mw600/0073tLPGgy1fy7qsfqcg2j30p010g1d2.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.url);
    if (options.url) {
      this.setData({
        url: options.url,
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

  bindSaveImage: function (e) {
    var url = this.data.url;
    wx.getSetting({
      success(res) {
        console.log(res);
        console.log(res.authSetting['scope.writePhotosAlbum']);
        
        if (res.authSetting['scope.writePhotosAlbum'] == null) {
          // 没有过授权信息
          console.log('false');
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.getImageInfo({
                src: url,
                success(res) {
                  console.log(res);
                  wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(res) {
                      console.log(res);
                      wx.showToast({
                        title: '已保存',
                        icon: 'success',
                      })
                    },
                    fail(res) {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none',
                      })
                    }
                  })
                }
              })
              
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] == false) {
          console.log('false');
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
            }
          })
        }
        
        else if (res.authSetting['scope.writePhotosAlbum'] == true){
          wx.getImageInfo({
            src: url,
            success(res) {
              console.log(res);
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success(res) {
                  console.log(res);
                  wx.showToast({
                    title: '已保存',
                    icon: 'success',
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                  })
                }
              })
            }
          })
        }
      }
    })


  }
})