/**
 * 海错图 - Canvas 渲染器
 * 负责绘制游戏界面：棋盘、生物、UI等
 */

// 渲染配置
const RENDER_CONFIG = {
  padding: 10,
  cellSpacing: 8,
  backgroundColor: '#0a1929',
  boardColor: '#0f2840',
  cellColor: '#143152'
};

// 计算单元格大小
function calculateCellSize(canvasWidth, canvasHeight) {
  const availableWidth = canvasWidth - 2 * RENDER_CONFIG.padding - (BOARD_SIZE - 1) * RENDER_CONFIG.cellSpacing;
  const availableHeight = canvasHeight - 120 - 2 * RENDER_CONFIG.padding - (BOARD_SIZE - 1) * RENDER_CONFIG.cellSpacing;
  return Math.floor(Math.min(availableWidth / BOARD_SIZE, availableHeight / BOARD_SIZE));
}

// 获取单元格坐标
function getCellRect(x, y, cellSize) {
  const left = RENDER_CONFIG.padding + x * (cellSize + RENDER_CONFIG.cellSpacing);
  const top = RENDER_CONFIG.padding + y * (cellSize + RENDER_CONFIG.cellSpacing) + 60;
  return {
    left,
    top,
    width: cellSize,
    height: cellSize,
    centerX: left + cellSize / 2,
    centerY: top + cellSize / 2
  };
}

// 绘制背景水泡动画
function drawBubbles(ctx, width, height, time) {
  ctx.fillStyle = RENDER_CONFIG.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制渐变背景
  const gradient = ctx.createRadialGradient(width / 2, height / 3, 50, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, '#0f2840');
  gradient.addColorStop(1, RENDER_CONFIG.backgroundColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 画几个浮动的水泡
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const size = 20 + i * 15;
    const x = (i * 137 % width) + Math.sin(time / 1000 + i) * 50;
    const y = (height - ((time / 2 + i * 100) % (height + 100))) - size;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// 绘制棋盘
function drawBoard(ctx, board, width, height, selectedCell, dragX, dragY, dragCell) {
  // 如果board还没初始化，直接返回不绘制
  if (!board) return;
  
  const cellSize = calculateCellSize(width, height);
  
  // 棋盘背景
  ctx.fillStyle = RENDER_CONFIG.boardColor;
  const boardTotalSize = BOARD_SIZE * cellSize + (BOARD_SIZE - 1) * RENDER_CONFIG.cellSpacing;
  const boardLeft = RENDER_CONFIG.padding;
  const boardTop = 60 + RENDER_CONFIG.padding;
  ctx.fillRoundRect(
    boardLeft - 5,
    boardTop - 5,
    boardTotalSize + 10,
    boardTotalSize + 10,
    10
  );
  
  // 绘制每个单元格
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const rect = getCellRect(x, y, cellSize);
      const creatureId = board[y][x];
      
      // 单元格背景
      if (creatureId) {
        const creature = getCreatureById(creatureId);
        ctx.fillStyle = creature.color + 'dd';
      } else {
        ctx.fillStyle = RENDER_CONFIG.cellColor;
      }
      
      if (selectedCell && selectedCell.x === x && selectedCell.y === y) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
      }
      
      ctx.beginPath();
      ctx.roundRect(rect.left, rect.top, rect.width, rect.height, 8);
      ctx.fill();
      ctx.stroke();
      
      // 如果有生物，绘制生物
      if (creatureId) {
        drawCreature(ctx, rect, getCreatureById(creatureId));
      }
    }
  }
  
  // 绘制拖拽预览 - 半透明跟随鼠标连续移动
  if (dragCell && typeof dragX === 'number' && typeof dragY === 'number') {
    // 获取当前拖拽生物
    const creatureId = game.board[dragCell.y][dragCell.x];
    if (creatureId) {
      const creature = getCreatureById(creatureId);
      const cellSize = calculateCellSize(width, height);
      // 生物跟着鼠标走，不是吸附到格子中心，这样更顺滑
      const centerX = dragX - (game.canvas.getBoundingClientRect().left);
      const centerY = dragY - (game.canvas.getBoundingClientRect().top);
      const size = cellSize - 16; // padding
      
      // 半透明预览跟随鼠标
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制emoji在预览中心
      ctx.font = `${size * 0.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(creature.emoji || creature.name[0], centerX, centerY + 2);
    }
  }
}

// 绘制单个生物
function drawCreature(ctx, rect, creature) {
  const padding = 8;
  const size = Math.min(rect.width, rect.height) - padding * 2;
  
  // 绘制圆形背景
  ctx.fillStyle = creature.color;
  ctx.beginPath();
  ctx.arc(rect.centerX, rect.centerY, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 高亮边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 绘制emoji或文字
  ctx.font = `${size * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(creature.emoji || creature.name[0], rect.centerX, rect.centerY + 2);
  
  // 绘制名称
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(creature.name, rect.centerX, rect.top + 16);
}

// 绘制顶部UI：分数、图鉴按钮等
function drawTopUI(ctx, width, score, unlockedCount, maxCount) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, width, 60);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`海错图`, 16, 35);
  
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`图鉴: ${unlockedCount}/${maxCount}`, width - 16, 22);
  ctx.fillText(`分数: ${score}`, width - 16, 42);
}

// 检查点击位置是否在棋盘，返回坐标
function getCellAtPoint(clientX, clientY, canvas, cellSize) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((clientX - rect.left - RENDER_CONFIG.padding) / (cellSize + RENDER_CONFIG.cellSpacing));
  const y = Math.floor((clientY - rect.top - 60 - RENDER_CONFIG.padding) / (cellSize + RENDER_CONFIG.cellSpacing));
  
  if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
    return {x, y};
  }
  return null;
}

// 添加 roundRect polyfill - only add if it doesn't exist
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    }
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
  };
}

// 导出 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    RENDER_CONFIG,
    calculateCellSize,
    getCellRect,
    drawBubbles,
    drawBoard,
    drawCreature,
    drawTopUI,
    getCellAtPoint
  };
} else {
  // 浏览器环境，暴露到全局
  window.RENDER_CONFIG = RENDER_CONFIG;
  window.calculateCellSize = calculateCellSize;
  window.getCellRect = getCellRect;
  window.drawBubbles = drawBubbles;
  window.drawBoard = drawBoard;
  window.drawCreature = drawCreature;
  window.drawTopUI = drawTopUI;
  window.getCellAtPoint = getCellAtPoint;
}
