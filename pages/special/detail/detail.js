// pages/special/detail/detail.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail_id: 9,
    praise: 0,
    collection: 0,
    aritcleDetail:null,
    subject_id: 0,
    praise_num: 0,
    collection_num: 0,
    lvdouappid: 'wx586501a5b03c99be',
    hasLawList: false,
    sharemarks: 0,
    previewImage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail_id = options.detail_id;
    var subject_id = options.subject_id;
    console.log(detail_id);
    console.log(subject_id);
    this.setData({
      detail_id: detail_id,
      subject_id: subject_id,
    });
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
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    });
    $.post(

      'fyapiprj/webService/article/viewSubjectArticle',
      {
        skey: wx.getStorageSync('skey'),
        subjectId: this.data.subject_id,
        articleId: this.data.detail_id,
      },
      function (res) {
        
        var aritcleDetail = res.data.data;
        var hasLawList = false;

        if (aritcleDetail.lawList.length != 0) {
          for (var i = 0; i < aritcleDetail.lawList.length; i++) {
            var lawResault = aritcleDetail.lawList[i].lawTitle + '：' + aritcleDetail.lawList[i].lawContent;
            aritcleDetail.lawList[i].lawContent = lawResault.substring(0, 38) + '…';
          }
          hasLawList = true;
        }

        that.setData({
          aritcleDetail: aritcleDetail,
          praise: aritcleDetail.isDigg,
          praise_num: aritcleDetail.diggNum,
          collection: aritcleDetail.isCollect,
          collection_num: aritcleDetail.collectNum,
          hasLawList: hasLawList,
        });
        wx.hideLoading();
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
  onShareAppMessage: function () {
  
  },

  bindLabel: function() {
    // 点击标签
  },

  bindPraise: function (e) {
    // 点赞
    
    var that = this;
    
    if (this.data.praise == 0) {
      // 点赞
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
      }
      $.post(
        'fyapiprj/webService/article/digg',
        {
          articleId: this.data.detail_id,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          that.setData({
            praise: 1,
            praise_num: that.data.praise_num + 1,
          });
        }
      )
    }else {
      // 取消赞
      $.post(
        'fyapiprj/webService/article/cancelDigg',
        {
          articleId: this.data.detail_id,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          console.log(res);
          that.setData({
            praise: 0,
            praise_num: that.data.praise_num - 1,
          });
        }
      )
    }

  },
  bindCollection: function (e) {
    // 分享
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
    }
    var that = this;
    if (this.data.collection == 0) {
      // 分享
      $.post(
        'fyapiprj/webService/article/collect',
        {
          articleId: this.data.detail_id,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          that.setData({
            collection: 1,
            collection_num: that.data.collection_num + 1,
          });
        }
      )
    } else {
      // 取消分享 
      $.post(
        'fyapiprj/webService/article/cancelCollect',
        {
          articleId: this.data.detail_id,
          skey: wx.getStorageSync('skey'),
        },
        function (res) {
          that.setData({
            collection: 0,
            collection_num: that.data.collection_num - 1,
          });
        }
      )
    }
  },

  bindNext: function(e) {
    // 下一篇
    var nextid = e.currentTarget.dataset.nextid;
    if(nextid) {
      this.setData({
        detail_id: nextid,
      });
      this.onShow();
    }else {
      wx.showToast({
        title: '已经是最后一篇了',
        icon:'none'
      })
    }
    

  },
  bindShare: function (e) {
    // 收藏
    this.setData({
      share: true,
    });
    wx.showActionSheet({
      itemList: ['分享好友', '分享到朋友圈', '生成问答式卡片'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  bindAuthor: function(e) {
    var authorid = e.currentTarget.dataset.authorid;
    wx.navigateTo({
      url: '../../personal/personal?personal_id=' + authorid,
    })
  },

  bindReturn: function (e) {
    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  bindLaw: function (e) {
    wx.navigateTo({
      url: '../../home/law/law?article_id=' + this.data.detail_id,
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

  saveImage: function (e) {
    var that = this;
    wx.downloadFile({
      url: this.data.aritcleDetail.cardPic1,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            
            wx.showToast({
              title: '保存成功',
              icon: 'success',
            });
            that.setData({
              previewImage: 0,
            });
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
  },

  hideAllChioce: function (e) {
    this.setData({
      previewImage: 0,
    });
  },

  previewImageShow: function (e) {
    this.setData({
      sharemarks: 0,
      previewImage: 1,
    });
  },

  
})