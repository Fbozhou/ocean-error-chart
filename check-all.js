// =============================================
// 纯网页版 - 微信小程序 API 模拟
// 完全移除微信依赖，所有API用浏览器原生实现
// =============================================

// 全局 wx 对象模拟
window.wx = {
  // 获取系统信息
  getSystemInfoSync: function() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1
    };
  },
  
  // 创建画布 - 直接返回已有的canvas
  createCanvas: function() {
    return document.getElementById('game-canvas');
  },
  
  // 设备方向监听 - 浏览器不需要，空实现
  onDeviceOrientationChange: function() {},
  stopDeviceOrientationListening: function() {},
  startDeviceOrientationListening: function() {},
  
  // 选择器查询 - 空实现
  createSelectorQuery: function() {
    return {
      select: () => this,
      boundingClientRect: () => this,
      exec: () => {}
    };
  }
};

// =============================================
// 小程序框架模拟 - 适配原代码结构
// =============================================

// getApp 模拟
window.getApp = function() {
  return window.app;
};

// App 全局实例
window.app = {
  globalData: {
    userId: 'browser_user_' + Date.now(),
    systemInfo: wx.getSystemInfoSync()
  },
  
  // API 请求封装 - 浏览器 fetch 实现
  request: function(options) {
    const url = options.url;
    const fullUrl = window.location.origin + '/api' + url;
    
    fetch(fullUrl, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.method === 'POST' ? JSON.stringify(options.data || {}) : undefined
    })
    .then(response => response.json())
    .then(data => {
      options.success && options.success(data);
    })
    .catch(error => {
      console.error('[API] 请求失败:', error);
      options.fail && options.fail(error);
    });
  }
};

// Page 模拟 - 网页版直接调用onLoad
window.Page = function(pageConfig) {
  // 保存页面配置，等待DOM加载完成后调用
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
      pageConfig.onLoad && pageConfig.onLoad();
      startGameLoop();
    }, 100);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      pageConfig.onLoad && pageConfig.onLoad();
      startGameLoop();
    });
  }
};

// =============================================
// 游戏循环 - 浏览器 requestAnimationFrame
// =============================================

function startGameLoop() {
  document.getElementById('loading').style.display = 'none';
  
  function loop() {
    if (typeof window.gameLoop === 'function') {
      window.gameLoop();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// =============================================
// 工具函数 - 网页版增强
// =============================================

// 全屏切换
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('fullscreen-btn').textContent = '退出';
  } else {
    document.exitFullscreen();
    document.getElementById('fullscreen-btn').textContent = '全屏';
  }
}

// 窗口大小改变自适应
window.addEventListener('resize', function() {
  if (window.game && window.game.renderer) {
    window.game.width = window.innerWidth;
    window.game.height = window.innerHeight;
    window.game.renderer.resize(window.game.width, window.game.height);
    if (window.game.garden) {
      window.game.garden.resize(window.game.width, window.game.height);
    }
  }
});

// 全局错误处理
window.addEventListener('error', function(e) {
  console.error('Game error:', e.error);
  const loading = document.getElementById('loading');
  loading.innerHTML = 
    '<div class=\"error\">' +
    '<h3>加载出错</h3>' +
    '<p>' + e.error.message + '</p>' +
    '<p style="font-size: 12px; margin-top: 10px; opacity: 0.8">行: ' + (e.lineno || 'unknown') + '<br>按F12打开控制台查看详细信息</p>' +
    '</div>';
  loading.style.display = 'block';
});

// 触摸事件兼容
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
// =============================================
// API 模块 - 后端接口封装
// 原结构保持不变，导出为全局变量
// =============================================

var module = { exports: {} };
var module = { exports: {} };
var module = { exports: {} };
// 《海错图》接口封装 - 浏览器版本
// 已经适配为浏览器 fetch API

// 用户模块
const user = {
  // 获取用户信息
  getInfo(userId, callback) {
    const request = getApp().request;
    request({
      url: "/user/info/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 领取离线收益
  collectOfflineIncome(userId, callback) {
    const request = getApp().request;
    request({
      url: "/user/collect-offline-income/${userId}",
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
  doCombine(userId, creatureId1, creatureId2, callback) {
    const request = getApp().request;
    request({
      url: '/combine/do',
      method: 'POST',
      data: {
        userId,
        creatureId1,
        creatureId2
      },
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取用户已解锁生物列表
  getUserList(userId, callback) {
    const request = getApp().request;
    request({
      url: "/combine/user-list/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取全量生物配置
  getAllList(callback) {
    const request = getApp().request;
    request({
      url: '/combine/all-list',
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 解锁海域
  unlockSeaArea(userId, seaAreaId, callback) {
    const request = getApp().request;
    request({
      url: "/combine/unlock-sea-area/${userId}/${seaAreaId}",
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 钓鱼奇遇模块
const fish = {
  // 执行钓鱼
  doFish(userId, callback) {
    const request = getApp().request;
    request({
      url: "/fish/do/${userId}",
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取今日剩余钓鱼次数
  getRemaining(userId, callback) {
    const request = getApp().request;
    request({
      url: "/fish/remaining/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 看广告增加钓鱼次数
  addByAd(userId, callback) {
    const request = getApp().request;
    request({
      url: "/fish/add-by-ad/${userId}",
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
    const request = getApp().request;
    request({
      url: "/yard/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 放置/更换神兽
  placeCreature(userId, slotId, creatureId, callback) {
    const request = getApp().request;
    request({
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
    const request = getApp().request;
    request({
      url: "/yard/unlock/${userId}/${slotId}/${cost}",
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
    const request = getApp().request;
    request({
      url: "/social/steal/${userId}/${friendId}",
      method: 'POST',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 检查今天是否可蹭
  canSteal(userId, callback) {
    const request = getApp().request;
    request({
      url: "/social/can-steal/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 分享奖励（获得饵料）
  getShareReward(userId, callback) {
    const request = getApp().request;
    request({
      url: "/social/share-reward/${userId}",
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
    const request = getApp().request;
    request({
      url: "/illustration/list/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  },

  // 获取用户图鉴统计
  getStats(userId, callback) {
    const request = getApp().request;
    request({
      url: "/illustration/stats/${userId}",
      method: 'GET',
      success: res => {
        callback && callback(res.data);
      }
    });
  }
};

// 导出模块
module.exports = {
  user,
  combine,
  fish,
  yard,
  social,
  illustration
};

// 导出API到全局变量 - 纯网页版本不需要模块，直接全局可用
window.api = module.exports;
window.user = module.exports.user;
window.combine = module.exports.combine;
window.fish = module.exports.fish;
window.yard = module.exports.yard;
window.social = module.exports.social;
window.illustration = module.exports.illustration;

// =============================================
// 游戏主逻辑
// =============================================
// 确保wx对象一定存在，所有API都定义好
if (typeof window === 'object') {
  window.wx = window.wx || {};
  if (!window.wx.onDeviceOrientationChange) {
    window.wx.onDeviceOrientationChange = function() {};
    window.wx.stopDeviceOrientationListening = function() {};
    window.wx.startDeviceOrientationListening = function() {};
  }
  if (!window.wx.createSelectorQuery) {
    window.wx.createSelectorQuery = function() {
      return {
        select: function() { return this; },
        boundingClientRect: function() { return this; },
        exec: function() {}
      };
    };
  }
}
if (typeof window === 'object') {
  window.wx = window.wx || {};
  if (!window.wx.onDeviceOrientationChange) {
    window.wx.onDeviceOrientationChange = function() {};
    window.wx.stopDeviceOrientationListening = function() {};
    window.wx.startDeviceOrientationListening = function() {};
  }
  if (!window.wx.createSelectorQuery) {
    window.wx.createSelectorQuery = function() {
      return {
        select: function() { return this; },
        boundingClientRect: function() { return this; },
        exec: function() {}
      };
    };
  }
}
// 补全微信小程序API - 必须放在最前面
if (typeof window !== 'undefined' && !window.wx) {
  window.wx = {};
}
if (!window.wx.onDeviceOrientationChange) {
  window.wx.onDeviceOrientationChange = function() {};
  window.wx.stopDeviceOrientationListening = function() {};
  window.wx.startDeviceOrientationListening = function() {};
  window.wx.createSelectorQuery = function() {
    return {
      select: function() { return this; },
      boundingClientRect: function() { return this; },
      exec: function() {}
    };
  };
}
var module = { exports: {} };
// 《海错图》国风合成小游戏 - 浏览器适配版本
// 原始代码适配微信小程序，这里模拟wx API给浏览器

// 模拟wx全局对象
window.wx = {
  getSystemInfoSync: function() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  },
  createCanvas: function() {
    // 在浏览器中，canvas已经创建在DOM中
    return document.getElementById('game-canvas');
  }
};
// 浏览器启动游戏
window.onload = function() {
  initGame();
};

// ========== 工具函数: roundRect ==========
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  return ctx;
}

// 添加 fillRoundRect 和 strokeRoundRect polyfill (兼容所有浏览器)
if (!CanvasRenderingContext2D.prototype.fillRoundRect) {
  CanvasRenderingContext2D.prototype.fillRoundRect = 
  function(x, y, width, height, radius) {
    roundRect(this, x, y, width, height, radius);
  this.fill();
  return this;
};
CanvasRenderingContext2D.prototype.strokeRoundRect = 
  function(x, y, width, height, radius) {
    roundRect(this, x, y, width, height, radius);
  this.stroke();
  return this;
};
}
