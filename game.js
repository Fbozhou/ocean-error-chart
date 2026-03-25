// 《海错图》国风合成小游戏 - 主入口
// 依赖加载：所有模块会挂载到 window
// js/data.js      - 生物数据定义
// js/merge-board.js - 合成棋盘逻辑
// js/renderer.js  - 渲染器
// js/handbook.js  - 图鉴场景
// js/fishing.js   - 钓鱼奇遇
// js/garden.js    - 海底小院

// 游戏全局状态
const game = {
  // 画布相关
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,

  // 核心模块
  board: null,
  renderer: null,
  handbook: null,
  fishing: null,
  garden: null,

  // 状态
  currentScene: 'merge', // merge | handbook | fishing | garden
  bait: 100, // 初始饵料
  unlockedCreatures: [1], // 已解锁生物，初始有1级
  mergedCount: 0, // 合成次数统计

  // 拖拽状态
  dragStart: null, // {r, c}
  isDragging: false,

  // 动画
  animationId: null,
};

// 初始化游戏
function initGame() {
  // 获取系统信息
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  game.width = windowWidth;
  game.height = windowHeight;

  // 创建画布
  game.canvas = wx.createCanvas();
  game.ctx = game.canvas.getContext('2d');
  game.canvas.width = windowWidth;
  game.canvas.height = windowHeight;

  // 初始化roundRect兼容 - 微信小游戏不支持原型修改，我们自己实现
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
  }
  // 添加到原型，如果可以的话
  try {
    if (game.ctx.constructor && !game.ctx.constructor.prototype.roundRect) {
      game.ctx.constructor.prototype.roundRect = function (x, y, width, height, radius) {
        roundRect(this, x, y, width, height, radius);
      };
    }
  } catch (e) {
    // 如果修改原型失败，不影响，后面我们手动调用
    console.log('无法修改Canvas原型，使用兼容方式', e);
  }

  // 保存全局引用给其他模块
  window.roundRect = roundRect;

  // 初始化模块
  game.board = new MergeBoard(5);
  game.renderer = new Renderer(game.canvas, game.ctx, game.board);
  game.handbook = new HandbookScene();
  game.fishing = new FishingScene();
  game.garden = new GardenScene();

  game.renderer.resize(windowWidth, windowHeight);
  game.garden.resize(windowWidth, windowHeight);

  // 初始生成两个1级生物
  game.board.spawnRandom(1);
  game.board.spawnRandom(1);

  // 绑定事件
  bindEvents();

  // 开始渲染循环
  gameLoop();

  console.log('海错图小游戏初始化完成');
}

// 绑定触摸事件
function bindEvents() {
  game.canvas.offTouchStart();
  game.canvas.offTouchMove();
  game.canvas.offTouchEnd();

  game.canvas.onTouchStart(handleTouchStart);
  game.canvas.onTouchMove(handleTouchMove);
  game.canvas.onTouchEnd(handleTouchEnd);
}

// 触摸开始
function handleTouchStart(e) {
  const { x, y } = e.touches[0];

  // 底部导航点击
  const navItem = game.renderer.getNavItem(x, y);
  if (navItem) {
    game.currentScene = navItem;
    if (navItem === 'fishing' && game.fishing.state === 'idle') {
      // 同步每日次数从后端，这里先保留逻辑
    }
    render();
    return;
  }

  if (game.currentScene === 'merge') {
    const pos = game.renderer.getGridPosition(x, y);
    if (pos && game.board.grid[pos.r][pos.c]) {
      game.dragStart = pos;
      game.isDragging = true;
    }
  } else if (game.currentScene === 'fishing') {
    game.fishing.handleTap();
  } else if (game.currentScene === 'garden') {
    game.garden.handleTap(x, y);
  }

  render();
}

// 触摸移动
function handleTouchMove(e) {
  if (!game.isDragging || game.currentScene !== 'merge') {
    if (game.currentScene === 'handbook') {
      const { y } = e.touches[0];
      const lastY = e.changedTouches[0].clientY;
      const deltaY = (e.changedTouches[0].clientY - e.touches[0].clientY);
      game.handbook.handleTouchMove(deltaY);
      render();
    }
    return;
  }

  const { x, y } = e.touches[0];
  const endPos = game.renderer.getGridPosition(x, y);

  // 只需要记录位置，渲染处理虚线跟随
  game.dragEnd = endPos;
  render();
}

// 触摸结束
function handleTouchEnd(e) {
  if (!game.isDragging || game.currentScene !== 'merge') {
    game.isDragging = false;
    game.dragStart = null;
    game.dragEnd = null;
    return;
  }

  const { x, y } = e.changedTouches[0];
  const endPos = game.renderer.getGridPosition(x, y);

  if (endPos && game.dragStart) {
    if (endPos.r === game.dragStart.r && endPos.c === game.dragStart.c) {
      // 点击同一个格子，不处理
    } else if (endPos && !game.board.grid[endPos.r][endPos.c]) {
      // 移动到空位
      game.board.move(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
      checkMerges();
      spawnNew();
    } else if (endPos && game.board.grid[endPos.r][endPos.c]) {
      // 目标格子有生物，尝试合并
      if (game.board.grid[game.dragStart.r][game.dragStart.c].level ===
        game.board.grid[endPos.r][endPos.c].level) {
        // 可以合并
        const newCreature = game.board.merge(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
        if (newCreature) {
          // 合成成功，解锁生物
          unlockCreature(newCreature.level);
          game.bait += Math.floor(newCreature.level * 2); // 合成奖励饵料
          game.mergedCount++;

          // 高级生物添加到小院
          if (newCreature.level >= 20) {
            game.garden.addCreature(newCreature);
          }

          // 震动反馈
          wx.vibrateShort({ type: 'light' });

          // 生成新的
          spawnNew();

          wx.showToast({
            title: `合成成功！${newCreature.name}`,
            icon: 'none'
          });
        }
      } else {
        // 不能合并，移动过去
        game.board.move(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
      }
    }
  }

  // 检查游戏结束
  if (game.board.isGameOver()) {
    wx.showModal({
      title: '棋盘已满',
      content: '没有可合并的生物了，是否清空重开？',
      success: (res) => {
        if (res.confirm) {
          game.board.clear();
          game.board.spawnRandom(1);
          game.board.spawnRandom(1);
        }
      }
    });
  }

  game.isDragging = false;
  game.dragStart = null;
  game.dragEnd = null;

  render();
}

// 检测相邻合并（简单AI，如果两个相同相邻，自动合并？这里不需要，用户拖动合并）
function checkMerges() {
  // 保留位置，后续可能需要自动合并逻辑
}

// 生成新的1级生物
function spawnNew() {
  if (game.bait <= 0) {
    wx.showToast({
      title: '饵料不足啦，去钓鱼或分享获得吧',
      icon: 'none'
    });
    return false;
  }

  const emptyCount = game.board.getEmptyCount();
  if (emptyCount === 0) return false;

  game.bait--;
  // 90%概率 1级，10%概率 2级
  const level = Math.random() > 0.9 ? 2 : 1;
  game.board.spawnRandom(level);
  return true;
}

// 解锁生物
function unlockCreature(level) {
  if (!game.unlockedCreatures.includes(level)) {
    game.unlockedCreatures.push(level);
    const creature = CREATURE_DATA.getCreatureByLevel(level);
    // 解锁提示
    wx.showToast({
      title: `解锁新生物：${creature.name}`,
      icon: 'none',
      duration: 2000
    });

    // 解锁奖励饵料
    game.bait += level;
  }
}

// 一键整理（压缩到底部）
function autoCollapse() {
  if (game.currentScene !== 'merge') return;
  const changed = game.board.collapseDown();
  if (changed) {
    render();
  } else {
    wx.showToast({
      title: '已经是最整齐的啦',
      icon: 'none'
    });
  }
}

// 主循环
function gameLoop() {
  // 钓鱼场景需要更新动画
  if (game.currentScene === 'fishing') {
    game.fishing.update();
  }

  // 小院场景需要更新浮动
  if (game.currentScene === 'garden') {
    game.garden.update();
  }

  render();
  game.animationId = requestAnimationFrame(gameLoop);
}

// 渲染一帧
function render() {
  const ctx = game.ctx;

  // 清屏
  const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
  gradient.addColorStop(0, '#0a1929');
  gradient.addColorStop(1, '#001e3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, game.width, game.height);

  // 根据场景渲染
  if (game.currentScene === 'merge') {
    game.renderer.render({
      currentScene: game.currentScene,
      bait: game.bait,
    });
  } else if (game.currentScene === 'handbook') {
    // 绘制背景已经做了
    game.handbook.render(ctx, game.width, game.height, game.unlockedCreatures);
    // 仍然需要绘制底部导航
    game.renderer.drawBottomNav({ currentScene: game.currentScene });
  } else if (game.currentScene === 'fishing') {
    game.fishing.render(ctx, game.width, game.height);
    game.renderer.drawBottomNav({ currentScene: game.currentScene });
  } else if (game.currentScene === 'garden') {
    game.garden.render(ctx, game.width, game.height);
    game.renderer.drawBottomNav({ currentScene: game.currentScene });
  }
}

// 分享游戏（获取饵料奖励）
function shareGame() {
  // 微信分享需要用户触发，后端回调奖励
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
}

// 屏幕旋转处理
wx.onDeviceOrientationChange(() => {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  game.width = windowWidth;
  game.height = windowHeight;
  game.canvas.width = windowWidth;
  game.canvas.height = windowHeight;
  game.renderer.resize(windowWidth, windowHeight);
  game.garden.resize(windowWidth, windowHeight);
  render();
});

// 游戏入口 - 微信小游戏直接执行初始化
initGame();

// 导出方法供分享等回调
window.OceanErrorGame = {
  game,
  initGame,
  render,
  autoCollapse,
  unlockCreature
};
