// 《海错图》微信小游戏 - App入口
App({
  onLaunch() {
    console.log('海错图小游戏启动');
    // 检查登录
    this.login();
  },

  // 全局数据
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'https://your-api-domain.com/api', // 需要替换为实际后端地址
    bait: 0, // 当前饵料数
    unlockedCreatures: [], // 已解锁生物
  },

  // 微信登录
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 调用后端登录接口
          console.log('登录code', res.code);
          // TODO: 调用后端接口换取token
          // this.requestLogin(code);
        }
      },
      fail: (err) => {
        console.error('登录失败', err);
      }
    });
  },

  // 网络请求封装
  request(options) {
    const token = this.globalData.token;
    wx.request({
      url: this.globalData.apiBaseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200 && res.data.code === 0) {
          options.success && options.success(res.data);
        } else {
          wx.showToast({
            title: res.data.msg || '请求失败',
            icon: 'none'
          });
          options.fail && options.fail(res);
        }
      },
      fail: err => {
        console.error('请求错误', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        options.fail && options.fail(err);
      }
    });
  }
});
