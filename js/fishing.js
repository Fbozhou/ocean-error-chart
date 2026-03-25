// 《海错图》每日钓鱼奇遇场景
class FishingScene {
  constructor() {
    this.state = 'idle'; // idle -> casting -> pulling -> result
    this.castingProgress = 0;
    this.result = null;
    this.freeCount = 3; // 每日免费次数
  }

  resetDaily(freeCount = 3) {
    this.freeCount = freeCount;
    this.state = 'idle';
    this.result = null;
  }

  // 开始钓鱼
  cast() {
    if (this.freeCount <= 0) {
      wx.showToast({
        title: '今日次数已用完，看广告增加次数',
        icon: 'none'
      });
      return false;
    }

    this.state = 'casting';
    this.castingProgress = 0;
    this.freeCount--;
    return true;
  }

  // 更新钓鱼动画
  update() {
    if (this.state === 'casting') {
      this.castingProgress += 2;
      if (this.castingProgress >= 100) {
        this.pull();
      }
    }
  }

  // 拉杆，获得奖励
  pull() {
    // 随机奖励：饵料 80%，低等级生物 15%，高等级生物 5%
    const rand = Math.random();
    if (rand < 0.6) {
      this.result = { type: 'bait', amount: 50 + Math.floor(Math.random() * 100) };
    } else if (rand < 0.9) {
      const level = 1 + Math.floor(Math.random() * 10);
      const creature = CREATURE_DATA.getCreatureByLevel(level);
      this.result = { type: 'creature', creature };
    } else {
      const level = 10 + Math.floor(Math.random() * 15);
      const creature = CREATURE_DATA.getCreatureByLevel(level);
      this.result = { type: 'creature', creature };
    }
    this.state = 'result';
  }

  // 绘制
  render(ctx, width, height) {
    // 标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('每日奇遇 · 钓鱼', width / 2, 50);

    // 剩余次数
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`今日剩余次数: ${this.freeCount}`, width / 2, 75);

    // 绘制鱼竿和水
    this.drawWater(ctx, width, height);

    if (this.state === 'idle') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('点击水面开始钓鱼', width / 2, height / 2 - 100);
      if (this.freeCount <= 0) {
        ctx.fillStyle = '#FFD700';
        ctx.fillText('观看广告可获得更多次数', width / 2, height / 2 - 70);
      }
    } else if (this.state === 'casting') {
      // 进度条
      const barWidth = width - 80;
      const barHeight = 20;
      const barX = 40;
      const barY = height / 2 - 10;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(barX, barY, barWidth * (this.castingProgress / 100), barHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText('等待鱼儿上钩...', width / 2, barY - 15);
    } else if (this.state === 'result') {
      this.drawResult(ctx, width, height);
    }
  }

  drawWater(ctx, width, height) {
    const waterY = 150;
    const waterHeight = height - 200;
    const gradient = ctx.createLinearGradient(0, waterY, 0, height - 50);
    gradient.addColorStop(0, 'rgba(50, 100, 150, 0.3)');
    gradient.addColorStop(1, 'rgba(20, 50, 100, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(20, waterY, width - 40, waterHeight);

    // 波纹
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(40, waterY + 50 + i * 40);
      for (let x = 40; x < width - 40; x += 20) {
        const y = waterY + 50 + i * 40 + Math.sin((x + this.castingProgress) * 5);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  drawResult(ctx, width, height) {
    const centerY = height / 2 - 20;

    if (this.result.type === 'bait') {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('获得饵料', width / 2, centerY - 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px sans-serif';
      ctx.fillText('+' + this.result.amount + ' 🥢', width / 2, centerY + 20);
    } else {
      const creature = this.result.creature;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('钓到了', width / 2, centerY - 50);

      const rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);
      ctx.fillStyle = rarityColor;
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(creature.name, width / 2, centerY + 5);

      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '14px sans-serif';
      ctx.fillText(`${creature.rarity} Lv.${creature.level}', width / 2, centerY + 35);
    }

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '14px sans-serif';
    ctx.fillText('点击继续', width / 2, height - 100);
  }

  // 处理点击
  handleTap() {
    if (this.state === 'idle') {
      return this.cast();
    } else if (this.state === 'result') {
      this.state = 'idle';
      this.result = null;
      return true;
    }
    return false;
  }
}

window.FishingScene = FishingScene;
