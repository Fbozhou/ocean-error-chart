// 《海错图》海底小院场景
class GardenScene {
  constructor() {
    this.placedCreatures = []; // 放置在小院里的生物
    this.width = 0;
    this.height = 0;
  }

  // 添加生物到小院
  addCreature(creature) {
    // 随机位置
    const x = 50 + Math.random() * (this.width - 100);
    const y = 150 + Math.random() * (this.height - 250);
    this.placedCreatures.push({
      creature,
      x,
      y,
      size: 80 + Math.random() * 40,
      floatOffset: Math.random() * Math.PI * 2
    });
    return true;
  }

  // 移除生物
  removeCreature(index) {
    if (index >= 0 && index < this.placedCreatures.length) {
      this.placedCreatures.splice(index, 1);
      return true;
    }
    return false;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  update() {
    // 浮动动画
    this.placedCreatures.forEach(item => {
      item.floatOffset += 0.02;
      item.y += Math.sin(item.floatOffset) * 0.2;
    });
  }

  render(ctx, width, height) {
    // 标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('海底小院', width / 2, 40);

    if (this.placedCreatures.length === 0) {
      ctx.fillStyle = '#aaaaaa';
      ctx.font = '16px sans-serif';
      ctx.fillText('合成获得的神兽会自动放到这里展示', width / 2, 100);
      ctx.fillText('当前小院是空的', width / 2, 130);
      return;
    }

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '14px sans-serif';
    ctx.fillText(this.placedCreatures.length + ' 只神兽在这里生活', width / 2, 70);

    // 海底沙地
    const sandY = height - 120;
    const gradient = ctx.createLinearGradient(0, sandY, 0, height);
    gradient.addColorStop(0, '#c2b280');
    gradient.addColorStop(1, '#a08a50');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, sandY, width, 120);
    ctx.fillStyle = '#8a7a40';
    for (let i = 0; i < width; i += 10) {
      ctx.fillRect(i + Math.random() * 5, sandY + 80 + Math.random() * 30, 3, 30);
    }

    // 绘制放置的生物
    this.placedCreatures.forEach(item => {
      const { creature, x, y, size } = item;
      const rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

      // 圆形背景
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
      gradient.addColorStop(0, creature.color);
      gradient.addColorStop(1, rarityColor);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // 名称
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold ' + Math.floor(size / 4) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(creature.name, x, y + 5);
    });
  }

  // 处理点击，点击生物可以移除
  handleTap(x, y) {
    for (let i = this.placedCreatures.length - 1; i >= 0; i--) {
      const item = this.placedCreatures[i];
      const dx = x - item.x;
      const dy = y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < item.size / 2) {
        // 询问是否移除
        wx.showModal({
          title: '移除生物',
          content: '是否将 ' + item.creature.name + ' 从小院移除？',
          success: (res) => {
            if (res.confirm) {
              this.removeCreature(i);
            }
          }
        });
        return true;
      }
    }
    return false;
  }
}

window.GardenScene = GardenScene;
