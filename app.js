import config from './config';
import memberState from './utils/memberState';
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    memberState.initLogin();
    if (memberState.isLogin() === false) {
      console.log('wx.login');
      // 登录
      wx.login({
        success: res => {
          wx.request({
            url: config.Host + '/handlers/wxAppLoginCallback.ashx',
            data: {
              code: res.code
            },
            success: (res) => {
              const data = res.data;
              if (data.result === 1) {
                memberState.saveLogin(data.member_id, true);
              }
              else {
                console.warn(data.msg);
              }
            },
            fail: (msg) => {
              console.error(msg);
            }
          });
        }
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})