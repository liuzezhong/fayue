// pages/article/article.js
import $ from '../../../common/common.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id: 707,
    share: false,
    praise: 0,
    collection: 0,
    aritcleDetail: null,
    praise_num: 0,
    collection_num: 0,
    popupShow: false,
    popupAllShow: true,
    recommendArticleList: null,
    lvdouappid: 'wx586501a5b03c99be',
    hasLawList: false,
    randomMode: 0,
    roundId: 3,
    countTry: 0,
    sharemarks: 0,
    previewImage: 0,
    noReturn: 0, //页面中无返回按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (new Date(wx.getStorageSync('popupAllShowDate')).toDateString() != new Date().toDateString()) {
      wx.setStorageSync('popupAllShow', true);
      wx.setStorageSync('popupAllShowDate', Date.now());
    }

    var roundId = parseInt(Math.random() * (6 + 1 - 3) + 3);
    if (options.article_id) {
      this.setData({
        article_id: options.article_id,
        roundId: roundId,
      });
    }

    if (options.noReturn) {
      this.setData({
        noReturn: options.noReturn,
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var thats = this;
    $.post(
      'fyapiprj/webService/article/view', {
        articleId: this.data.article_id,
        skey: wx.getStorageSync('skey'),
        randomMode: this.data.randomMode,
      },
      function(res) {
        console.log(res);

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
          randomMode: 0,
        });
        wx.hideLoading();

      }
    )

    $.post(
      'fyapiprj/webService/article/guess', {
        articleId: that.data.article_id,
        categoryId: 0
      },
      function(res) {
        console.log('articleList:' + res.data.data.articleList);
        if (res.data.data.articleList.length != 0) {
          thats.setData({
            recommendArticleList: res.data.data.articleList,
          });
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    this.setData({
      sharemarks: 0,
    });
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.aritcleDetail.articleTitle,
      path: '/pages/home/article/article?article_id=' + this.data.article_id,
    }
  },

  bindPersonal: function(e) {
    wx.navigateTo({
      url: '../../personal/personal?personal_id=' + e.currentTarget.dataset.id,
    })
  },

  bindCounsel: function(e) {
    // 点击咨询按钮
    console.log(e);
  },

  bindAttribute: function(e) {
    // 点击标签
    console.log(e);
    var search_input = e.currentTarget.dataset.value;
    var search_type = 2; // 1正常搜索，2按标签搜索
    wx.navigateTo({
      url: '../../search/index/index?search_input=' + search_input + '&search_type=' + search_type,
    })
  },

  bindLaw: function(e) {
    wx.navigateTo({
      url: '../law/law?article_id=' + this.data.article_id,
    })
  },

  bindChange: function(e) {
    // 换一批
    var that = this;
    wx.showLoading({
      title: '玩命加载中…',
    })
    $.post(
      'fyapiprj/webService/article/guess', {},
      function(res) {
        that.setData({
          recommendArticleList: res.data.data.articleList,
        });
        wx.hideLoading();

      }
    )
  },

  bindReturn: function(e) {
    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  bindReturnHome: function(e) {
    // 回首页
    wx.switchTab({
      url: '/pages/home/index/index'
    })
  },

  bindTry: function(e) {
    // 试试手气
    var that = this;
    var thats = this;
    var thatss = this;
    wx.showLoading({
      title: '剪刀石头布',
    })

    var countTry = this.data.countTry;
    var roundId = this.data.roundId;

    var popupShow = false;

    if ((countTry + 1) % roundId == 0) {
      popupShow = true;
    }
    console.log(popupShow);
    if (popupShow == true && wx.getStorageSync('popupAllShow')) {
      setTimeout(function() {
        thatss.setData({
          countTry: countTry + 1,
          popupShow: popupShow,
        });
        wx.hideLoading();

      }, 1500);

    } else {
      $.post(
        'fyapiprj/webService/article/view', {
          articleId: this.data.article_id,
          skey: wx.getStorageSync('skey'),
          randomMode: 1,
        },
        function(res) {
          console.log(res.data);
          var aritcleDetail = res.data.data;
          var hasLawList = false;
          var articleId = aritcleDetail.articleId;
          if (aritcleDetail.lawList.length != 0) {
            for (var i = 0; i < aritcleDetail.lawList.length; i++) {
              var lawResault = aritcleDetail.lawList[i].lawTitle + '：' + aritcleDetail.lawList[i].lawContent;
              aritcleDetail.lawList[i].lawContent = lawResault.substring(0, 38) + '…';
            }
            hasLawList = true;
          }

          $.post(
            'fyapiprj/webService/article/guess', {
              articleId: articleId,
              categoryId: 0,
            },
            function(resa) {
              if (resa.data.data.articleList.length != 0) {
                thats.setData({
                  recommendArticleList: resa.data.data.articleList,
                });
              }
            }
          )

          that.setData({
            aritcleDetail: aritcleDetail,
            praise: aritcleDetail.isDigg,
            praise_num: aritcleDetail.diggNum,
            collection: aritcleDetail.isCollect,
            collection_num: aritcleDetail.collectNum,
            hasLawList: hasLawList,
            countTry: countTry + 1,
          });
          wx.hideLoading();
          wx.pageScrollTo({
            scrollTop: 0,
          });
          wx.showToast({
            title: '手气不错，又是一个知识点',
            icon: 'none',
            duration: 2000
          })
        }
      )
    }
  },

  bindArticle: function(e) {
    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
  },

  bindPraise: function(e) {
    // 点赞
    var that = this;
    if (wx.getStorageSync('authorization') == false) {
      wx.showToast({
        title: '请使用微信授权登录',
        icon: 'none',
        success(res) {
          setTimeout(function() {
            wx.switchTab({
              url: '../../mine/index/index?onshow=1',
            });
          }, 2000);
        }
      })
    } else {
      if (this.data.praise == 0) {
        // 点赞
        $.post(
          'fyapiprj/webService/article/digg', {
            articleId: this.data.article_id,
            skey: wx.getStorageSync('skey'),
          },
          function(res) {
            console.log(res);
            that.setData({
              praise: 1,
              praise_num: that.data.praise_num + 1,
            });
          }
        )
      } else {
        // 取消赞
        $.post(
          'fyapiprj/webService/article/cancelDigg', {
            articleId: this.data.article_id,
            skey: wx.getStorageSync('skey'),
          },
          function(res) {
            that.setData({
              praise: 0,
              praise_num: that.data.praise_num - 1,
            });
          }
        )
      }
    }

  },

  bindCollection: function(e) {
    // 分享
    console.log(e);
    if (wx.getStorageSync('authorization') == false) {
      wx.showToast({
        title: '请使用微信授权登录',
        icon: 'none',
        success(res) {
          setTimeout(function() {
            wx.switchTab({
              url: '../../mine/index/index?onshow=1',
            });
          }, 2000);
        }
      })
    } else {
      var that = this;
      if (this.data.collection == 0) {
        // 分享
        $.post(
          'fyapiprj/webService/article/collect', {
            articleId: this.data.article_id,
            skey: wx.getStorageSync('skey'),
          },
          function(res) {
            that.setData({
              collection: 1,
              collection_num: that.data.collection_num + 1,
            });
          }
        )
      } else {
        // 取消分享 
        $.post(
          'fyapiprj/webService/article/cancelCollect', {
            articleId: this.data.article_id,
            skey: wx.getStorageSync('skey'),
          },
          function(res) {
            that.setData({
              collection: 0,
              collection_num: that.data.collection_num - 1,
            });
          }
        )
      }
    }

  },
  bindNext: function(e) {
    // 下一篇

  },
  bindShare: function(e) {
    // 收藏
    this.setData({
      share: true,
    });
    wx.showActionSheet({
      // itemList: ['分享好友', '分享到朋友圈', '生成问答式卡片'],
      itemList: ['分享好友', '分享到朋友圈'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          this.onShareAppMessage();
        }
      },
      fail: function(res) {
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

  bindChangePopup: function(e) {
    console.log(e);
    this.setData({
      popupShow: false,
    });
  },

  noAllPopup: function(e) {
    this.setData({
      popupAllShow: false,
      popupShow: false,
    });

    wx.setStorageSync('popupAllShow', false);
  },

  bindService: function(e) {
    // 跳转小程序
  },

  bindShareMarks: function(e) {
    this.setData({
      sharemarks: 1,
    });
  },

  closeMarks: function(e) {
    this.setData({
      sharemarks: 0,
    });
  },

  saveImage: function(e) {
    var that = this;
    wx.downloadFile({
      url: this.data.aritcleDetail.cardPic1,
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
            })
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

  hideAllChioce: function(e) {
    this.setData({
      previewImage: 0,
    });
  },

  previewImageShow: function(e) {
    this.setData({
      sharemarks: 0,
      previewImage: 1,
    });
  }
})