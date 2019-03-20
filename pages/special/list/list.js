// pages/special/list/list.js
import $ from '../../../common/common.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    order: 1,
    special_id: 1,
    memberId: 1,
    specialDetail: null,
    pageNo: 1,
    pageSize: 10,
    specialList: [],
    getAllList: false,
    sharemarks: 0,
    previewImage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var special_id = options.special_id;
    this.setData({
      special_id: special_id,
    });

    var roundId = Math.random() * (8 + 1 - 3) + 3;
    console.log(roundId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var thats = this;
    var thatss =this;
    wx.showLoading({
      title: '玩命加载中',
    });
    $.post(
      'fyapiprj/webService/subject/getArticleSubject',
      {
        skey: wx.getStorageSync('skey'),
        subjectId: this.data.special_id,

      },
      function (res) {
        console.log(res.data);
        that.setData({
          specialDetail: res.data.data.articleSubject,
          order: res.data.data.isSubscribe,
        });
        wx.hideLoading();
      }
    ),

      $.post(
        'fyapiprj/webService/subject/getArticleSubjectArticle',
        {
          subjectId: thats.data.special_id,
          pageNo: thats.data.pageNo,
          pageSize: thats.data.pageSize,

        },
        function (res) {
          console.log(res.data);
          thats.setData({
            specialList: res.data.data,
          });
        }
      )

      // 专题推荐
    $.post(
      'fyapiprj/webService/subject/articleSubjectRecommend2',
      {
        size: 3,
        subjectId: thatss.data.special_id,
      },
      function (res) {
        console.log(res.data);
        thatss.setData({
          speciaRecommendlList: res.data.data,
        });
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
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    var pageNo = this.data.pageNo + 1;

    $.post(
      'fyapiprj/webService/subject/getArticleSubjectArticle',
      {
        subjectId: that.data.special_id,
        pageNo: pageNo,
        pageSize: that.data.pageSize,
      },
      function (res) {
        if (res.data.data.length != 0) {
          var specialList = that.data.specialList;
          for (var i = 0; i < res.data.data.length; i++) {
            specialList.push(res.data.data[i]);
          }
          that.setData({
            specialList: specialList,
            pageNo: pageNo,
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '到底啦',
            icon: 'none',
          })
          that.setData({
            getAllList: true,
          });
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      sharemarks: 0,
    });
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.specialDetail.subjectName,
      path: '/pages/special/list/list?special_id=' + this.data.special_id,
    }
  },


  bindShare: function(e) {
    this.setData({
      share: true,
    });
    wx.showActionSheet({
      itemList: ['分享好友', '分享到朋友圈',],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  bindDetail: function(e) {
    console.log(this.data.special_id);
    wx.navigateTo({
      url: '../detail/detail?detail_id=' + e.currentTarget.dataset.article_id + '&subject_id=' + this.data.special_id,
    })
  },

  bindOrder: function(e) {
    // 订阅
    var that = this;
    wx.showModal({
      title: '订阅该专题',
      content: '您将收到专题更新提醒',
      cancelText: '朕再想想',
      cancelColor: '#000000',
      confirmText: '朕准了',
      confirmColor: '#FFD900',
      success: function (res) {
        if (this.data.order == 0) {
          $.post(
            'fyapiprj/webService/subject/subscribeSubject',
            {
              skey: wx.getStorageSync('skey'),
              subjectId: this.data.special_id,
            },
            function (res) {
              that.setData({
                order: 1,
              });
            }
          )

        } else {
          $.post(
            'fyapiprj/webService/subject/unsubscribeSubject',
            {
              skey: wx.getStorageSync('skey'),
              subjectId: this.data.special_id,
            },
            function (res) {
              console.log(res.data);
              that.setData({
                order: 0,
              });
            }
          )
        }
      }
    })
  },

  bindSubjectList: function (e) {
    // 跳转专题列表页
    var special_id = e.currentTarget.dataset.subject_id;
    console.log(special_id);
    wx.navigateTo({
      url: '../../special/list/list?special_id=' + special_id,
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
  },

  closeMarks: function (e) {
    this.setData({
      sharemarks: 0,
    });
  },
  bindShareMarks: function (e) {
    this.setData({
      sharemarks: 1,
    });
  },

  saveImage: function (e) {
    var that = this;
    wx.downloadFile({
      url: this.data.specialDetail.cardPic,
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
  }
})