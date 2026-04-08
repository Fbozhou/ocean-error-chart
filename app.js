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
    userId: null,
    token: null,
    apiBaseUrl: 'http://118.196.127.168:8081/api', // 后端接口基础路径
    bait: 0, // 当前饵料数
    unlockedCreatures: [], // 已解锁生物
  },

  // 微信登录 - 调用后端接口获取用户信息
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('微信登录code', res.code);
          this.wxLogin(res.code);
        }
      },
      fail: (err) => {
        console.error('微信登录失败', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 调用后端微信登录接口
  wxLogin(code) {
    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (userRes) => {
        const { nickName, avatarUrl } = userRes.userInfo;
        that.request({
          url: '/user/wx-login',
          method: 'POST',
          data: {
            code: code,
            nickname: nickName,
            avatarUrl: avatarUrl
          },
          success: (res) => {
            const userData = res.data;
            that.globalData.userInfo = {
              nickName,
              avatarUrl
            };
            that.globalData.userId = userData.userId;
            that.globalData.bait = userData.currentBait;
            that.globalData.unlockedSeaArea = userData.unlockedSeaArea;
            that.globalData.maxLevel = userData.maxLevel;
            that.globalData.canStealToday = userData.canStealToday;
            that.globalData.offlineIncome = userData.offlineIncome;
            that.globalData.unlockedSlots = userData.unlockedSlots;
            console.log('登录成功', userData);
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            // 加载已解锁生物
            that.loadUserCreatures();
          },
          fail: (err) => {
            console.error('后端登录失败', err);
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },

  // 加载用户已解锁生物
  loadUserCreatures() {
    if (!this.globalData.userId) return;
    this.request({
      url: `/combine/user-list/${this.globalData.userId}`,
      method: 'GET',
      success: (res) => {
        this.globalData.unlockedCreatures = res.data || [];
        console.log('已加载用户生物列表', this.globalData.unlockedCreatures);
      }
    });
  },

  // 获取全量生物配置
  loadAllCreatures(callback) {
    this.request({
      url: '/combine/all-list',
      method: 'GET',
      success: (res) => {
        callback && callback(res.data);
      }
    });
  },

  // 网络请求封装 - 符合后端统一响应格式
  request(options) {
    const url = this.globalData.apiBaseUrl + options.url;
    wx.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          options.success && options.success(res.data);
        } else {
          const msg = res.data?.msg || '请求失败';
          wx.showToast({
            title: msg,
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
