// 《海错图》Canvas渲染器
class Renderer {
  constructor(canvas, ctx, board) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.board = board;
    this.width = 0;
    this.height = 0;
    this.cellSize = 0;
    this.boardOffset = { x: 0, y: 0 };
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;

    // 计算棋盘大小（棋盘占上部，底部留UI空间）
    const boardMaxSize = Math.min(width, height - 160);
    this.cellSize = Math.floor(boardMaxSize / this.board.size);
    const totalBoardSize = this.cellSize * this.board.size;

    // 居中棋盘
    this.boardOffset.x = Math.floor((width - totalBoardSize) / 2);
    this.boardOffset.y = 20;
  }

  // 绘制整个场景
  render(gameState) {
    // 清空画布 - 深海渐变背景
    this.drawBackground();

    // 绘制棋盘网格
    this.drawBoard();

    // 绘制所有生物
    this.drawCreatures();

    // 绘制顶部UI（饵料等）
    this.drawTopUI(gameState);

    // 绘制底部导航
    this.drawBottomNav(gameState);
  }

  // 绘制渐变深海背景
  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#0a1929');
    gradient.addColorStop(1, '#001e3c');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 画点水泡效果
    this.drawBubbles();
  }

  // 画水泡装饰
  drawBubbles() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const r = Math.random() * 10 + 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 绘制棋盘格子
  drawBoard() {
    const { x: offsetX, y: offsetY } = this.boardOffset;

    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        const cellX = offsetX + c * this.cellSize;
        const cellY = offsetY + r * this.cellSize;
        const padding = 4;

        // 格子背景
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.beginPath();
        this.ctx.roundRect(cellX + padding, cellY + padding,
          this.cellSize - padding * 2, this.cellSize - padding * 2, 8);
        this.ctx.fill();
      }
    }
  }

  // 绘制所有生物
  drawCreatures() {
    const { x: offsetX, y: offsetY } = this.boardOffset;
    const padding = 4;

    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        const creature = this.board.grid[r][c];
        if (!creature) continue;

        const cellX = offsetX + c * this.cellSize;
        const cellY = offsetY + r * this.cellSize;
        const size = this.cellSize - padding * 2;

        this.drawCreatureCell(cellX + padding, cellY + padding, size, creature);
      }
    }
  }

  // 绘制单个生物格子
  drawCreatureCell(x, y, size, creature) {
    const rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

    // 外发光效果
    const gradient = this.ctx.createRadialGradient(
      x + size / 2, y + size / 2, 0,
      x + size / 2, y + size / 2, size / 2
    );
    gradient.addColorStop(0, creature.color);
    gradient.addColorStop(1, rarityColor);

    // 圆角矩形背景
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, size, size, 12);
    this.ctx.fill();

    // 边框
    this.ctx.strokeStyle = rarityColor;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // 绘制文字（名称）
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.textAlign = 'center';
    this.ctx.font = `bold ${Math.floor(size / 5)}px sans-serif`;
    this.ctx.fillText(creature.name, x + size / 2, y + size / 2 + 6);

    // 等级
    this.ctx.font = `${Math.floor(size / 8)}px sans-serif`;
    this.ctx.fillText(`Lv.${creature.level}`, x + size / 2, y + size - 10);
  }

  // 绘制顶部UI
  drawTopUI(gameState) {
    const boardBottom = this.boardOffset.y + this.board.size * this.cellSize;

    // 半透明背景
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(10, boardBottom + 10, this.width - 20, 60);

    // 饵料显示
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 20px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`饵料: ${gameState.bait}`, 25, boardBottom + 48);

    // 提示文字
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'right';
    let hint = '';
    switch (gameState.currentScene) {
      case 'merge':
        hint = '拖动相同生物合成';
        break;
      case 'handbook':
        hint = '海错图图鉴';
        break;
      case 'garden':
        hint = '海底小院';
        break;
      case 'fishing':
        hint = '每日奇遇';
        break;
    }
    this.ctx.fillText(hint, this.width - 25, boardBottom + 48);
  }

  // 绘制底部导航
  drawBottomNav(gameState) {
    const navHeight = 60;
    const navY = this.height - navHeight - 10;
    const itemWidth = this.width / 4;

    // 背景
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.fillRect(10, navY, this.width - 20, navHeight);

    const items = [
      { key: 'merge', name: '合成' },
      { key: 'handbook', name: '图鉴' },
      { key: 'fishing', name: '奇遇' },
      { key: 'garden', name: '小院' }
    ];

    items.forEach((item, idx) => {
      const itemX = 10 + idx * itemWidth;
      const isActive = gameState.currentScene === item.key;

      this.ctx.fillStyle = isActive ? 'rgba(100, 200, 255, 0.3)' : 'transparent';
      this.ctx.fillRect(itemX + 2, navY + 5, itemWidth - 6, navHeight - 10);

      this.ctx.fillStyle = isActive ? '#64C8FF' : '#aaaaaa';
      this.ctx.font = isActive ? 'bold 16px sans-serif' : '16px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(item.name, itemX + itemWidth / 2, navY + navHeight / 2 + 6);
    });
  }

  // 获取点击位置对应的棋盘坐标
  getGridPosition(clientX, clientY) {
    const { x: offsetX, y: offsetY } = this.boardOffset;
    const c = Math.floor((clientX - offsetX) / this.cellSize);
    const r = Math.floor((clientY - offsetY) / this.cellSize);

    if (r >= 0 && r < this.board.size && c >= 0 && c < this.board.size) {
      return { r, c };
    }
    return null;
  }

  // 获取点击的底部导航
  getNavItem(clientX, clientY) {
    const navHeight = 60;
    const navY = this.height - navHeight - 10;

    if (clientY < navY || clientY > navY + navHeight) return null;

    const itemWidth = (this.width - 20) / 4;
    const idx = Math.floor((clientX - 10) / itemWidth);
    const items = ['merge', 'handbook', 'fishing', 'garden'];
    return items[idx] || null;
  }

  // 添加 roundRect 兼容
  initRoundRect() {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (typeof radius === 'number') {
          radius = { tl: radius, tr: radius, br: radius, bl: radius };
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
  }
}

// 导出
window.Renderer = Renderer;
