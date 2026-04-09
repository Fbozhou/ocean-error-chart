/**
 * 海错图 - 合成棋盘核心逻辑
 * 5x5 棋盘，两个相同合成更高一级
 */

// 棋盘大小
const BOARD_SIZE = 5;

// 初始化空棋盘
function createEmptyBoard() {
  const board = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    board[y] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      board[y][x] = null;
    }
  }
  return board;
}

// 在空位随机生成一个新生物
function spawnRandomCreature(board, maxLevel) {
  // 收集所有空位
  const emptyPositions = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!board[y][x]) {
        emptyPositions.push({x, y});
      }
    }
  }
  
  if (emptyPositions.length === 0) {
    return null; // 棋盘满了
  }
  
  // 随机选一个空位
  const pos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  
  // 随机生成等级，最高不超过maxLevel
  // 动态概率：等级越低，概率越高；等级越高，概率越低
  let level;
  const r = Math.random();
  
  // 累计概率，从最低等级开始，等级越低权重越大
  let cumulative = 0;
  for (let l = 1; l <= maxLevel; l++) {
    // 概率权重：最高等级概率是 1/(l^2)，等级越低权重越大
    const weight = 1 / (l * l);
    cumulative += weight;
    if (r <= cumulative) {
      level = l;
      break;
    }
  }
  
  // 如果没选中（浮点精度问题），默认选最低等级1
  if (!level) level = 1;
  
  // 找对应id
  const creature = CREATURE_DATA.find(c => c.level === level);
  board[pos.y][pos.x] = creature ? creature.id : 1;
  
  return pos;
}

// 检查两个相邻格子是否可以合并
function canMerge(board, x1, y1, x2, y2) {
  const id1 = board[y1][x1];
  const id2 = board[y2][x2];
  
  if (!id1 || !id2) return false;
  if (id1 !== id2) return false;
  
  const creature = getCreatureById(id1);
  const maxLevel = getMaxLevel();
  if (creature.level >= maxLevel) return false; // 顶级不能再合
  
  return true;
}

// 执行合并
function doMerge(board, x1, y1, x2, y2) {
  const id = board[y1][x1];
  const creature = getCreatureById(id);
  const nextLevel = getNextLevel(creature.level);
  const nextCreature = CREATURE_DATA.find(c => c.level === nextLevel);
  
  // 清空两个原位置，在第一个位置放新生物
  board[y1][x1] = null;
  board[y2][x2] = null;
  board[y1][x1] = nextCreature.id;
  
  return nextCreature;
}

// 检查棋盘是否还有可合并的
function hasAvailableMoves(board) {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!board[y][x]) continue;
      
      // 检查右和下相邻
      if (x < BOARD_SIZE - 1 && canMerge(board, x, y, x + 1, y)) {
        return true;
      }
      if (y < BOARD_SIZE - 1 && canMerge(board, x, y, x, y + 1)) {
        return true;
      }
    }
  }
  return false;
}

// 计算得分：合并得到几级就得几分
function calculateScore(level) {
  return level * level * 10;
}

// 获取棋盘空位数量
function getEmptyCount(board) {
  let count = 0;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!board[y][x]) count++;
    }
  }
  return count;
}

// 导出 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    BOARD_SIZE,
    createEmptyBoard,
    spawnRandomCreature,
    canMerge,
    doMerge,
    hasAvailableMoves,
    calculateScore,
    getEmptyCount
  };
} else {
  // 浏览器环境，暴露到全局
  window.BOARD_SIZE = BOARD_SIZE;
  window.createEmptyBoard = createEmptyBoard;
  window.spawnRandomCreature = spawnRandomCreature;
  window.canMerge = canMerge;
  window.doMerge = doMerge;
  window.hasAvailableMoves = hasAvailableMoves;
  window.calculateScore = calculateScore;
  window.getEmptyCount = getEmptyCount;
}
