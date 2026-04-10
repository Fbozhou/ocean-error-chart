// 《海错图》接口封装 - 按照后端文档实现
// 使用方式：const app = getApp(); app.api.xxx(...)

const app = getApp();

// 用户模块
const user = {
  // web端创建测试/匿名用户
  createTestUser(callback) {
    app.request({
      url: '/user/create-test-user',
      method: 'POST',
      data: {},
      success: res => {
        callback && callback(res);
      }
    });
  },
  
  // 微信登录（创建/获取用户）
  wxLogin(data, callback) {
    app.request({
      url: '/user/wx-login',
      method: 'POST',
      data: data,
      success: res => {
        callback && callback(res);
      }
    });
  },
  
  // 获取用户信息
  getInfo(userId, callback) {
    app.request({
      url: `/user/info/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 领取离线收益
  collectOfflineIncome(userId, callback) {
    app.request({
      url: `/user/collect-offline-income/${userId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 合成模块
const combine = {
  // 执行合成操作
  doCombine(userId, fromCell, toCell, callback) {
    app.request({
      url: '/combine/do',
      method: 'POST',
      data: {
        userId,
        fromCell,
        toCell
      },
      success: res => {
        callback && callback(res);
      }
    });
  },

  // 获取用户已解锁生物列表
  getUserList(userId, callback) {
    app.request({
      url: `/combine/user-list/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res);
      }
    });
  },

  // 获取全量生物配置
  getAllList(callback) {
    app.request({
      url: '/combine/all-list',
      method: 'GET',
      success: res => {
        callback && callback(res);
      }
    });
  },

  // 解锁海域
  unlockSeaArea(userId, seaAreaId, callback) {
    app.request({
      url: `/combine/unlock-sea-area/${userId}/${seaAreaId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 钓鱼奇遇模块
const fish = {
  // 开始钓鱼
  startFish(userId, seaAreaId, callback) {
    app.request({
      url: '/fish/start',
      method: 'POST',
      data: {
        userId,
        seaAreaId
      },
      success: res => {
        callback && callback(res);
      }
    });
  },

  // 执行钓鱼
  doFish(userId, callback) {
    app.request({
      url: `/fish/do/${userId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取今日剩余钓鱼次数
  getRemaining(userId, callback) {
    app.request({
      url: `/fish/remaining/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 看广告增加钓鱼次数
  addByAd(userId, callback) {
    app.request({
      url: `/fish/add-by-ad/${userId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 庭院模块
const yard = {
  // 获取用户庭院信息
  getYardInfo(userId, callback) {
    app.request({
      url: `/yard/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 放置/更换神兽
  placeCreature(userId, slotId, creatureId, callback) {
    app.request({
      url: '/yard/place',
      method: 'POST',
      data: {
        userId,
        slotId,
        creatureId: creatureId || null
      },
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 解锁槽位
  unlockSlot(userId, slotId, cost, callback) {
    app.request({
      url: `/yard/unlock/${userId}/${slotId}/${cost}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 社交模块
const social = {
  // 蹭好友饵料
  stealBait(userId, friendId, callback) {
    app.request({
      url: `/social/steal/${userId}/${friendId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 检查今天是否可蹭
  canSteal(userId, callback) {
    app.request({
      url: `/social/can-steal/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 分享奖励（获得饵料）
  getShareReward(userId, callback) {
    app.request({
      url: `/social/share-reward/${userId}`,
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 图鉴模块
const illustration = {
  // 获取用户已点亮图鉴列表
  getList(userId, callback) {
    app.request({
      url: `/illustration/list/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取用户图鉴统计
  getStats(userId, callback) {
    app.request({
      url: `/illustration/stats/${userId}`,
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 挂载到App上
module.exports = {
  user,
  combine,
  fish,
  yard,
  social,
  illustration
};
