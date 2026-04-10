// 《海错图》国风合成小游戏 - 网页原生版本
// 纯浏览器运行，不需要构建工具，直接打开就能玩

// ========== 全局游戏状态 ==========
let game = {
  scene: 'game', // game | handbook | fishing | garden
  width: 0,
  height: 0,
  canvas: null,
  ctx: null,
  board: null,
  score: 0,
  unlockedCreatures: [],
  maxLevel: 30,
  selectedCell: null,
  isDragging: false,
  dragCell: null,
  scrollOffset: 0,
  showDetailModal: false,
  selectedDetailCreature: null,
  // 钓鱼
  fishing: {
    remaining: 3,
    isCasting: false,
    progress: 0,
    result: null
  },
  // 小院
  garden: {
    slots: []
  },
  // 选择神兽弹窗
  showSelectModal: false,
  selectedSlot: null
};

// ========== 场景切换 ==========
function switchScene(sceneName) {
  game.scene = sceneName;
  game.selectedCell = null;
  game.showDetailModal = false;
  game.showSelectModal = false;
  render();
}

// ========== 初始化游戏 ==========
function initGame() {
  // 获取canvas
  game.canvas = document.getElementById('game-canvas');
  game.ctx = game.canvas.getContext('2d');
  
  // 绑定触摸/鼠标事件
  game.canvas.addEventListener('click', handleClick);
  game.canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
  game.canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
  game.canvas.addEventListener('touchend', handleTouchEnd);
  game.canvas.addEventListener('mousedown', handleMouseDown);
  game.canvas.addEventListener('mousemove', handleMouseMove);
  game.canvas.addEventListener('mouseup', handleMouseUp);
  
  // 适配屏幕
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 尝试从本地读取userId，如果没有则创建匿名用户
  let savedUserId = localStorage.getItem('ocean-userId');
  if (savedUserId) {
    // 本地已有userId，直接使用
    getApp().globalData.userId = parseInt(savedUserId);
    console.log('[API] 使用本地保存的 userId:', savedUserId);
    initGameAfterLogin();
  } else {
    // 没有userId，调用wx-login创建用户
    window.api.user.wxLogin({
      code: 'web-anonymous-' + Date.now(),
      nickname: '网页游客',
      avatarUrl: ''
    }, function(result) {
      console.log('[API] wx-login 返回:', result);
      if (result && result.code === 200 && result.data && result.data.userId) {
        const userId = result.data.userId;
        getApp().globalData.userId = userId;
        localStorage.setItem('ocean-userId', userId);
        console.log('[API] 新用户创建成功，userId:', userId);
      } else {
        // 登录失败，使用默认游客userId=1
        getApp().globalData.userId = 1;
        console.log('[API] 登录失败，使用默认 userId=1');
      }
      initGameAfterLogin();
    });
  }
}

// 登录完成后初始化游戏数据
function initGameAfterLogin() {
  const userId = getApp().globalData.userId;
  
  // 获取全量生物配置
  window.api.combine.getAllList(function(result) {
    console.log('[API] 获取全量生物列表返回:', result);
    
    // 如果后端返回了生物数据，用后端的，否则用本地的
    if (result && result.code === 200 && result.data && Array.isArray(result.data) && result.data.length > 0) {
      // 更新本地 CREATURE_DATA
      window.CREATURE_DATA = result.data;
      console.log('[API] 使用后端生物数据，共', result.data.length, '个');
    }
    
    // 获取用户已解锁生物列表
    window.api.combine.getUserList(userId, function(result) {
      console.log('[API] 获取用户已解锁生物返回:', result);
      
      // 初始化棋盘 - 必须在resize/render之前！
      game.board = window.createEmptyBoard();
      
      // 从后端加载用户已解锁生物
      if (result && result.code === 200 && result.data && Array.isArray(result.data)) {
        game.unlockedCreatures = result.data;
        console.log('[API] 用户已解锁生物:', result.data.length, '个');
      } else {
        // 初始解锁 1级磷虾
        game.unlockedCreatures = [1];
      }
      
      // 初始化生成三个生物：**两个固定1级磷虾，第三个随机**
      let placed = 0;
      // 放两个固定磷虾到最左下
      for (let y = window.BOARD_SIZE - 1; y >= window.BOARD_SIZE - 2 && placed < 2; y--) {
        for (let x = 0; x < 2 && placed < 2; x++) {
          if (!game.board[y][x]) {
            game.board[y][x] = 1; // 1 = 磷虾 id=1 level=1
            placed++;
          }
        }
      }
      // 第三个随机生成
      window.spawnRandomCreature(game.board, getCurrentMaxLevel());
      
      // 初始化小院
      game.garden.slots = JSON.parse(localStorage.getItem('ocean-garden-slots')) || window.DEFAULT_SLOTS;
      
      // 加载分数
      const savedScore = localStorage.getItem('ocean-score');
      if (savedScore) {
        game.score = parseInt(savedScore);
      } else {
        game.score = 30; // 默认初始给30积分
      }
      
      // 首次解锁1级
      if (!game.unlockedCreatures.includes(1)) {
        game.unlockedCreatures.push(1);
      }
      
      // 隐藏加载提示
      document.getElementById('loading').style.display = 'none';
      render();
    });
  });
}

// 调整画布大小 - 底部留出60px给按钮组
function resizeCanvas() {
  game.width = window.innerWidth;
  game.height = window.innerHeight - 60; // 底部留出60px放按钮
  game.canvas.width = game.width;
  game.canvas.height = game.height;
  if (game.board) {
    render();
  }
}

// ========== 主渲染循环 ==========
function render() {
  const ctx = game.ctx;
  const width = game.width;
  const height = game.height;
  
  // 绘制背景水泡
  window.drawBubbles(ctx, width, height, Date.now());
  
  switch (game.scene) {
    case 'game':
      drawTopUI(ctx, width, game.score, game.unlockedCreatures.length, window.CREATURE_DATA.length);
      if (game.board) {
        window.drawBoard(ctx, game.board, width, height, game.selectedCell, typeof dragX === 'number' ? dragX : null, typeof dragY === 'number' ? dragY : null, dragCell);
      }
      break;
    case 'handbook':
      if (game.showDetailModal && game.selectedDetailCreature) {
        window.drawHandbook(ctx, width, height, game.unlockedCreatures, game.scrollOffset);
        window.drawDetailModal(ctx, width, height, game.selectedDetailCreature);
      } else {
        window.drawHandbook(ctx, width, height, game.unlockedCreatures, game.scrollOffset);
      }
      break;
    case 'fishing':
      window.drawFishing(ctx, width, height, game.fishing.remaining, game.fishing.isCasting, game.fishing.progress, game.fishing.result);
      break;
    case 'garden':
      if (game.showSelectModal) {
        const placeable = window.getPlaceableCreatures(game.unlockedCreatures);
        window.drawGarden(ctx, width, height, game.garden.slots, game.unlockedCreatures);
        window.drawSelectModal(ctx, width, height, placeable);
      } else {
        window.drawGarden(ctx, width, height, game.garden.slots, game.unlockedCreatures);
      }
      break;
  }
}

// 持续渲染（动画用）
function gameLoop() {
  if (game.scene === 'game') {
    render();
  }
  requestAnimationFrame(gameLoop);
}

// ========== 输入处理 ==========
let startX, startY, isTouching = false;

function handleClick(e) {
  if (game.showDetailModal) {
    if (window.isClickOnDetail(e.clientX, e.clientY, game.width, game.height)) {
      game.showDetailModal = false;
      render();
    }
    return;
  }
  
  if (game.scene === 'game') {
    // 如果正在拖拽，点击不处理，避免点击直接升级
    if (isTouching && dragCell) return;
    
    const cellSize = window.calculateCellSize(game.width, game.height);
    const cell = window.getCellAtPoint(e.clientX, e.clientY, game.canvas, cellSize);
    if (!cell) return;
    
    handleGameCellClick(cell);
  } else if (game.scene === 'handbook') {
    const result = window.getCardAtPoint(e.clientX, e.clientY, game.width, game.height, game.scrollOffset);
    if (result && result._type === 'back') {
      switchScene('game');
    } else if (result && game.unlockedCreatures.includes(result.id)) {
      game.selectedDetailCreature = result;
      game.showDetailModal = true;
      render();
    }
  } else if (game.scene === 'fishing') {
    const result = window.checkClick(e.clientX, e.clientY);
    if (result === 'back') {
      switchScene('game');
    } else if (result === 'cast' && game.fishing.remaining > 0 && !game.fishing.isCasting && !game.fishing.result) {
      startFishing();
    }
  } else if (game.scene === 'garden') {
    if (game.showSelectModal) {
      const placeable = window.getPlaceableCreatures(game.unlockedCreatures);
      const selected = window.getSelectedCreature(e.clientX, e.clientY, game.width, game.height, placeable);
      if (selected === 'close') {
        game.showSelectModal = false;
        render();
      } else if (selected) {
        // 放置神兽
        if (game.selectedSlot) {
          game.selectedSlot.creatureId = selected.id;
          saveGardenData();
          game.showSelectModal = false;
          render();
        }
      }
    } else {
      const result = window.getClickedSlot(e.clientX, e.clientY, game.width, game.height, game.garden.slots);
      if (result && result.type === 'back') {
        switchScene('game');
      } else if (result && result.type === 'slot') {
        if (!result.slot.unlocked) {
          // 解锁
          if (game.score >= result.slot.cost) {
            game.score -= result.slot.cost;
            result.slot.unlocked = true;
            saveGardenData();
            saveScore();
            render();
          } else {
            alert('积分不足，需要' + result.slot.cost + '积分');
          }
        } else {
          // 选择神兽
          game.selectedSlot = result.slot;
          const placeable = window.getPlaceableCreatures(game.unlockedCreatures);
          if (placeable.length > 0) {
            game.showSelectModal = true;
            render();
          } else {
            alert('没有可放置的神兽，需要合成到20级以上才有');
          }
        }
      }
    }
  }
  
  render();
}

function handleGameCellClick(cell) {
  const {x, y} = cell;
  if (game.board[y][x]) return; // 格子已经有生物了，不能点击生成，返回
  // 只有空格才能点击生成
  
  window.spawnRandomCreature(game.board, getCurrentMaxLevel());
  
  saveGameState();
  render();
}

// ========== 拖拽支持 ==========
// 拖拽支持
let dragCell = null;
let dragX = 0;
let dragY = 0;

function handleMouseMove(e) {
  if (!isTouching || !dragCell) return;
  
  // 更新拖拽预览位置
  dragX = e.clientX;
  dragY = e.clientY;
  render();
}

function handleMouseDown(e) {
  startX = e.clientX;
  startY = e.clientY;
  dragX = e.clientX;
  dragY = e.clientY;
  isTouching = true;
  dragCell = null;
  
  if (game.scene !== 'game') return;
  
  // 按下的时候看看是不是按在一个生物上 - 如果是，开始拖拽
  const cellSize = window.calculateCellSize(game.width, game.height);
  const cell = window.getCellAtPoint(e.clientX, e.clientY, game.canvas, cellSize);
  if (cell && game.board[cell.y][cell.x]) {
    dragCell = {x: cell.x, y: cell.y};
    game.isDragging = true;
  }
}

function handleMouseUp() {
  if (!isTouching || !dragCell) {
    isTouching = false;
    game.isDragging = false;
    return;
  }
  
  if (game.scene !== 'game' || !dragCell) {
    dragCell = null;
    isTouching = false;
    game.isDragging = false;
    return;
  }
  
  // 松开的时候看看落点在哪里
  const cellSize = window.calculateCellSize(game.width, game.height);
  const endCell = window.getCellAtPoint(event.clientX, event.clientY, game.canvas, cellSize);
  
  if (!endCell) {
    // 落点不在任何格子，不操作
    dragCell = null;
    isTouching = false;
    game.isDragging = false;
    render();
    return;
  }
  
  // 禁止拖拽到**同一个格子自己合并自己**
  if (endCell.x === dragCell.x && endCell.y === dragCell.y) {
    // 落点是起点自己，不操作，直接取消拖拽
    dragCell = null;
    isTouching = false;
    game.isDragging = false;
    render();
    return;
  }
  
  if (!game.board[endCell.y][endCell.x]) {
    // 落点在**空格** - 把拖拽的生物移动到空格，**因为关闭自动生成，所以不再起点生成新生物**
    // 移动生物从dragCell to endCell
    game.board[endCell.y][endCell.x] = game.board[dragCell.y][dragCell.x];
    game.board[dragCell.y][dragCell.x] = null;
    
    saveGameState();
    dragCell = null;
    isTouching = false;
    game.isDragging = false;
    render();
    return;
  }
  
  // 落点在另一个生物
  if (game.board[endCell.y][endCell.x]) {
    // 落点在另一个生物 - 检查能不能合并
    if (window.canMerge(game.board, dragCell.x, dragCell.y, endCell.x, endCell.y)) {
      // 调用后端API执行合成
      const userId = getApp().globalData.userId;
      const fromCell = {x: dragCell.x, y: dragCell.y};
      const toCell = {x: endCell.x, y: endCell.y};
      
      window.api.combine.doCombine(userId, fromCell, toCell, function(result) {
        console.log('[API] 合成结果:', result);
        
        // 可以合并
        const merged = window.doMerge(game.board, dragCell.x, dragCell.y, endCell.x, endCell.y);
        game.score += window.calculateScore(merged.level);
        
        // 解锁新生物
        if (!game.unlockedCreatures.includes(merged.id)) {
          game.unlockedCreatures.push(merged.id);
          saveUnlocked();
          // 震动
          if ('vibrate' in navigator) navigator.vibrate(100);
          setTimeout(() => {
            alert(`🎉 解锁新生物：${merged.name}！`);
          }, 300);
        }
        
        // 合并完成，起点清空，终点放合并后的新生物
        game.board[dragCell.y][dragCell.x] = null;
        game.board[endCell.y][endCell.x] = merged.id;
        
        // 👉 需求：合并成功后，在随机空单元格自动生成一个新生物
        // 找所有空位，随机选一个生成
        const empty = [];
        for (let y = 0; y < window.BOARD_SIZE; y++) {
          for (let x = 0; x < window.BOARD_SIZE; x++) {
            if (!game.board[y][x]) empty.push({x, y});
          }
        }
        if (empty.length > 0) {
          const maxLevel = getCurrentMaxLevel();
          window.spawnRandomCreature(game.board, maxLevel);
        }
        
        saveGameState();
        dragCell = null;
        isTouching = false;
        game.isDragging = false;
        render();
      });
      return;
    }
    
    // 不能合并
    dragCell = null;
    isTouching = false;
    game.isDragging = false;
    render();
    return;
  }
}

// ========== 触摸事件封装 - 修复移动端拖拽适配问题 ==========
function handleTouchStart(e) {
  if (!e.cancelable) return;
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseDown(touch);
}

function handleTouchMove(e) {
  if (!e.cancelable) return;
  e.preventDefault();
  const touch = e.touches[0];
  handleMouseMove(touch);
}

function handleTouchEnd(e) {
  const touch = e.changedTouches[0];
  handleMouseUp(touch);
}

// ========== 存储 ==========
function saveGameState() {
  localStorage.setItem('ocean-board', JSON.stringify(game.board));
  localStorage.setItem('ocean-score', game.score);
  localStorage.setItem('ocean-unlocked', JSON.stringify(game.unlockedCreatures));
}

function saveScore() {
  localStorage.setItem('ocean-score', game.score);
}

function saveUnlocked() {
  localStorage.setItem('ocean-unlocked', JSON.stringify(game.unlockedCreatures));
}

function saveGardenData() {
  localStorage.setItem('ocean-garden-slots', JSON.stringify(game.garden.slots));
}

// ========== 获取当前最高等级 ==========
function getCurrentMaxLevel() {
  let max = 1;
  for (let y = 0; y < window.BOARD_SIZE; y++) {
    for (let x = 0; x < window.BOARD_SIZE; x++) {
      const id = game.board[y][x];
      if (id) {
        const c = window.getCreatureById(id);
        if (c.level > max) max = c.level;
      }
    }
  }
  return Math.min(max + 2, window.getMaxLevel());
}

// ========== 新增功能：整理棋盘 + 手动生成 ==========

// 整理棋盘：把所有生物往**左下角**紧凑排列，不合并，只整理位置
function arrangeBoard() {
  // 收集所有现有生物
  const creatures = [];
  for (let y = 0; y < window.BOARD_SIZE; y++) {
    for (let x = 0; x < window.BOARD_SIZE; x++) {
      if (game.board[y][x]) {
        creatures.push(game.board[y][x]);
        game.board[y][x] = null;
      }
    }
  }
  
  // 从**左下角**开始依次放
  let idx = 0;
  for (let y = window.BOARD_SIZE - 1; y >= 0; y--) {
    for (let x = 0; x < window.BOARD_SIZE; x++) {
      if (!game.board[y][x] && idx < creatures.length) {
        game.board[y][x] = creatures[idx];
        idx++;
      }
    }
  }
  
  saveGameState();
  render();
}

// 更新积分显示
function updateScoreDisplay() {
  const el = document.getElementById('score-display');
  if (el) {
    el.textContent = game.score;
  }
}

// 记住用户选择"不再提示"
function getSpawnConfirmDisabled() {
  return localStorage.getItem('ocean-spawn-confirm-disabled') === 'true';
}
function setSpawnConfirmDisabled(val) {
  localStorage.setItem('ocean-spawn-confirm-disabled', val ? 'true' : 'false');
}

// 消耗积分手动生成一个生物
function trySpawnByScore() {
  // 需要 10 积分生成一次
  const cost = 10;
  if (game.score < cost) {
    alert('积分不足，需要 10 积分才能生成');
    return;
  }

  // 找所有空位
  const emptyPositions = [];
  for (let y = 0; y < window.BOARD_SIZE; y++) {
    for (let x = 0; x < window.BOARD_SIZE; x++) {
      if (!game.board[y][x]) {
        emptyPositions.push({x, y});
      }
    }
  }

  if (emptyPositions.length === 0) {
    alert('棋盘已满，无法生成');
    return;
  }

  // 如果用户勾选了不再提示，直接生成
  if (getSpawnConfirmDisabled()) {
    doSpawnByScore(cost, emptyPositions);
    return;
  }

  // 弹出确认框
  const confirmed = confirm(`确认消耗 10 积分生成一个新生物吗？
当前积分：${game.score}`);
  if (confirmed) {
    // 问问要不要下次不再提示
    const disableConfirm = confirm('是否需要下次生成不再提示？\n(确定 = 不再提示，取消 = 保持每次确认)');
    setSpawnConfirmDisabled(disableConfirm);
    doSpawnByScore(cost, emptyPositions);
  }
}

// 实际执行生成
function doSpawnByScore(cost, emptyPositions) {
  // 扣除积分
  game.score -= cost;

  // 随机选一个空位生成
  const pos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const maxLevel = getCurrentMaxLevel();
  window.spawnRandomCreature(game.board, maxLevel);

  saveGameState();
  updateScoreDisplay();
  render();
}

// ========== 启动 ==========
window.addEventListener('DOMContentLoaded', () => {
  initGame();
  updateScoreDisplay();
  gameLoop();
});

// 导出给html导航用
window.arrangeBoard = arrangeBoard;
window.trySpawnByScore = trySpawnByScore;
window.switchScene = switchScene;
