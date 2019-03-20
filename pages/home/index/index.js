//index.js
//获取应用实例
import $ from '../../../common/common.js';
const appInstance = getApp()

Page({
  data: {
    navList: null,
    navDefaultChecked: true,
    chioceType: false,
    toView: 'default',
    scrollLeft: 0,
    rotateList: [],
    categoryId: 0,
    weapp_cid: 0,
    hotid_str: 0,
    pageNo: 1,
    pageSize: 10,
    articleList: null,
    hotList: null,
    subjectPageNo: 1,
    subjectPageSize: 3,
    subjectArticleSize: 5,
    subjectList: null,
    carouselSize: 4, // 轮播图的数量
    carouselList: null,
    getAllArtice: false,
    lvdouappid: 'wx586501a5b03c99be',
    popupShow: true,
    popupAllShow: true,
    submitSuccess: 1,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onReady: function () {
    wx.showLoading({
      title: '玩命加载中',
    })

    var thatsss = this;
    var that = this;
    var thats = this;
    var thatss = this;



    $.post(
      'fyapiprj/webService/article/list?categoryId=' + this.data.categoryId + '&weapp_cid=' + this.data.weapp_cid + '&hotid_str=' + this.data.hotid_str + '&pageNo=' + this.data.pageNo + '&pageSize=' + this.data.pageSize,
      {},
      function (res) {
        var articleList = res.data.data.articleList;
        var hotList = res.data.data.hotList.data;
        if (!hotList) {
          hotList = null;
        }
        console.log(res.data.data.articleList);
        console.log(articleList);
        console.log(articleList.length);
        if (articleList.length == 0) {
          articleList = null;
        }

        
        that.setData({
          articleList: articleList,
          hotList: hotList,
        });
        wx.hideLoading();
      }
    )

    $.post(
      'fyapiprj/webService/subject/articleSubjectRecommend?pageNo=' + thats.data.subjectPageNo + '&pageSize=' + thats.data.subjectPageSize + '&articleSize=' + thats.data.subjectArticleSize,
      {},
      function (res) {
        console.log(res);
        thats.setData({
          subjectList: res.data.data,
        });
        
      }
    )
   
    $.post(
      'fyapiprj/webService/carousel/home?size=' + thatss.data.carouselSize,
      {},
      function (res) {
        console.log('*****lunbo******');
        console.log(res.data);
        console.log('*****lunbo******');
        thats.setData({
          carouselList: res.data.data,
        });

      }
    )
    
  },

  onLoad: function (query) {
    if (!wx.getStorageSync('skey')) {
      appInstance.wxLogin();
    }
    console.log(query);
    this.setData({
      submitSuccess: wx.getStorageSync('submitSuccess'),
    });
    if(query.scene) {
      
      const scene = decodeURIComponent(query.scene)
      var sceneArray = scene.split('-');
      var channel = sceneArray[0];  // 渠道
      var page = sceneArray[1];  // 打开方式
      var parameter = sceneArray[2];  // 页面参数
      var otherParameter = sceneArray[3];  // 其它参数
      if (channel != 0) {
        // 0表示默认渠道，有渠道商时，渠道的用户记录+1
      }
      if(page == 1) {
        // 打开百科
        wx.navigateTo({
          url: '../article/article?article_id=' + parameter,
        })
      }else if(page == 2) {
        // 打开专题
        wx.navigateTo({
          url: '../../special/list/list?special_id=' + parameter,
        })
      }else if(page == 3) {
        // 打开专题文章
        wx.navigateTo({
          url: '../../special/detail/detail?detail_id=' + parameter + '&subject_id=' + otherParameter,
        })
      }else if(page == 4) {
        // 打开活动页面
      }else {
        // 默认为0 或其它打开首页
      }

      console.log('******scene*******');
      console.log(sceneArray);
      console.log('******scene*******');
    }
    
    var that = this;
    $.post(
      'fyapiprj/webService/article/category',
      {},
      function (res) {
        console.log(res);
        var navList = res.data.data;
        if (navList.length == 0) {
          navList = null;
        }
        that.setData({
          navList: navList,
        });
      }
    )

    
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindChangeNav: function (e) {
    var nav_id = e.currentTarget.dataset.id;
    var navList = this.data.navList;
    var toView = 'default';
    var scrollLeft = 0;
    for (var i = 0; i < navList.length; i++) {
      if (navList[i]['categoryId'] == nav_id) {
        navList[i]['ischecked'] = true;
        toView = navList[i]['id_name'];
        scrollLeft = (i + 1) * 50;
      } else {
        navList[i]['ischecked'] = false;
        toView = navList[i]['id_name'];
      }
    }
    this.setData({
      navList: navList,
      navDefaultChecked: false,
      chioceType: false,
      toView: toView,
      scrollLeft: scrollLeft,
      categoryId: nav_id,
    });
    this.onReady();
  },

  bindChangeDefNav: function (e) {
    var navList = this.data.navList;
    for (var i = 0; i < navList.length; i++) {
      navList[i]['ischecked'] = false;
    }
    this.setData({
      navList: navList,
      navDefaultChecked: true,
      chioceType: false,
      toView: 'default',
      scrollLeft: 0,
      categoryId: 0,
    });
    // this.onShow();
    this.onReady();

  },
  onShow: function (e) {
    
  },

  bindSearch: function (e) {
    wx.navigateTo({
      url: '../../search/index/index'
    })
  },

  bindArticle: function (e) {
    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
  },

  chioceType: function (e) {
    this.setData({
      chioceType: true,
    });
  },

  closeChioceType: function (e) {
    this.setData({
      chioceType: false,
    });
  },

  bindSubjectDetail: function (e) {
    // 跳转专题详情页
    var detail_id = e.currentTarget.dataset.detail_id;
    var special_id = e.currentTarget.dataset.subid;
    wx.navigateTo({
      url: '../../special/detail/detail?detail_id=' + detail_id + '&subject_id=' + special_id,
    })
  },

  bindSubjectList: function (e) {
    // 跳转专题列表页
    var special_id = e.currentTarget.dataset.subid;
    console.log(special_id);
    wx.navigateTo({
      url: '../../special/list/list?special_id=' + special_id,
    })
  },

  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true
    })
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
      'fyapiprj/webService/article/list?categoryId=' + this.data.categoryId + '&weapp_cid=' + this.data.weapp_cid + '&hotid_str=' + this.data.hotid_str + '&pageNo=' + pageNo + '&pageSize=' + this.data.pageSize,
      {},
      function (res) {
        if (res.data.data.articleList.length != 0) {
          var articleList = that.data.articleList;
          for (var i = 0; i < res.data.data.articleList.length; i++) {
            articleList.push(res.data.data.articleList[i]);
          }
          that.setData({
            articleList: articleList,
            pageNo: pageNo,
          });
          wx.hideLoading();
        }else {
          wx.hideLoading();
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
          })
          that.setData({
            getAllArtice: true,
          });
        }
        
      }
    )


  },
  bindChangePopup: function (e) {
    console.log(e);
    this.setData({
      submitSuccess: 1,
    });
  },

  bindSign: function(e) {
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
    }else {
      wx.navigateTo({
        url: '../../discover/sign/sign',
      })

      this.setData({
        submitSuccess: 1,
      });
    }
  },

  bindActivity: function(e) {
    wx.navigateTo({
      url: '../../discover/sign/sign',
    })
  }
})
