// 《海错图》图鉴场景渲染逻辑
class HandbookScene {
  constructor() {
    this.scrollOffset = 0;
    this.itemHeight = 120;
    this.cols = 2;
  }

  render(ctx, width, height, unlockedCreatures) {
    // 背景已经画过，直接画列表

    // 标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('海错图图鉴', width / 2, 40);

    // 统计
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(unlockedCreatures.length + '/30 已解锁', width / 2, 65);

    const startY = 80;
    const padding = 10;
    const itemWidth = (width - padding * (this.cols + 1)) / this.cols;

    CREATURE_DATA.CREATURES.forEach((creature, idx) => {
      const col = idx % this.cols;
      const row = Math.floor(idx / this.cols);
      const itemY = startY + row * this.itemHeight + this.scrollOffset;

      // 只画可见区域
      if (itemY + this.itemHeight < 80 || itemY > height - 80) return;

      const x = padding + col * (itemWidth + padding);
      const isUnlocked = unlockedCreatures.includes(creature.level);

      // 背景
      if (isUnlocked) {
        const rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);
        const gradient = ctx.createLinearGradient(x, itemY, x + itemWidth, itemY + this.itemHeight);
        gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
        gradient.addColorStop(1, 'rgba(' + this.hexToRgb(rarityColor) + ',0.2)');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
      }
      ctx.beginPath();
      roundRect(ctx, x, itemY, itemWidth, this.itemHeight - 10, 8);
      ctx.fill();

      if (isUnlocked) {
        this.drawUnlockedItem(ctx, x, itemY, itemWidth, creature);
      } else {
        this.drawLockedItem(ctx, x, itemY, itemWidth, creature);
      }
    });

    // 提示
    if (unlockedCreatures.length === 30) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 恭喜集齐全部海错图生物！', width / 2, height - 90);
    }
  }

  drawLockedItem(ctx, x, y, width, creature) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('???', x + width / 2, y + this.itemHeight / 2 - 10);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '12px sans-serif';
    ctx.fillText('未解锁', x + width / 2, y + this.itemHeight / 2 + 15);
  }

  drawUnlockedItem(ctx, x, y, width, creature) {
    const rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

    // 名称和等级
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(creature.name, x + 12, y + 25);

    ctx.fillStyle = rarityColor;
    ctx.font = '12px sans-serif';
    ctx.fillText(creature.rarity + ' · Lv.' + creature.level, x + 12, y + 42);

    // 描述文字
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px sans-serif';
    const maxWidth = width - 20;
    this.wrapText(ctx, creature.description, x + 10, y + 60, maxWidth, 16);
  }

  // 文字换行
  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  hexToRgb(hex) {
    // 移除 #
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return r + ', ' + g + ', ' + b;
  }

  // 处理滚动
  handleTouchMove(deltaY) {
    this.scrollOffset += deltaY;
    const totalRows = Math.ceil(CREATURE_DATA.CREATURES.length / this.cols);
    const maxScroll = - (totalRows * this.itemHeight - (this.getHeight() - 120));
    this.scrollOffset = Math.min(0, Math.max(maxScroll, this.scrollOffset));
  }

  getHeight() {
    return wx.getSystemInfoSync().windowHeight;
  }
}

// 导出
window.HandbookScene = HandbookScene;
