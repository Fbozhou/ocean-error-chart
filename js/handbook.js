/**
 * 海错图 - 图鉴场景
 * 展示所有已解锁的生物，带介绍
 */

// 绘制图鉴
function drawHandbook(ctx, width, height, unlockedCreatures, scrollOffset) {
  // 背景
  drawBubbles(ctx, width, height, Date.now());
  
  // 标题栏
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, width, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('海错图图鉴', width / 2, 30);
  
  // 返回提示
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('↩ 返回游戏', 16, 32);
  
  // 统计
  ctx.textAlign = 'right';
  const total = CREATURE_DATA.length;
  const unlocked = unlockedCreatures.length;
  ctx.fillText(`${unlocked}/${total}`, width - 16, 32);
  
  // 绘制网格卡片
  const cardPadding = 10;
  const cardWidth = (width - cardPadding * 3) / 2;
  const cardHeight = 120;
  const startY = 60 - scrollOffset;
  
  CREATURE_DATA.forEach((creature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const left = cardPadding + col * (cardWidth + cardPadding);
    const top = startY + row * (cardHeight + cardPadding);
    
    if (top > height || top + cardHeight < 50) {
      return; // 超出可视区域不画
    }
    
    const isUnlocked = unlockedCreatures.includes(creature.id);
    
    // 卡片背景
    ctx.fillStyle = isUnlocked ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.roundRect(left, top, cardWidth, cardHeight, 8);
    ctx.fill();
    
    if (isUnlocked) {
      // 彩色圆形
      ctx.fillStyle = creature.color;
      ctx.beginPath();
      ctx.arc(left + 40, top + 40, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // emoji
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(creature.emoji || creature.name[0], left + 40, top + 40);
      
      // 名称和来源
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(creature.name, left + 90, top + 28);
      
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(creature.source, left + 90, top + 48);
      
      // 描述（截断）
      ctx.font = '13px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      let desc = creature.description;
      if (desc.length > 35) desc = desc.slice(0, 32) + '...';
      ctx.fillText(desc, left + 90, top + 70);
    } else {
      // 未解锁
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('???', left + cardWidth / 2, top + cardHeight / 2);
    }
  });
  
  // 提示滑动
  if (scrollOffset === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('↓ 滑动查看更多', width / 2, height - 20);
  }
}

// 检查点击卡片
function getCardAtPoint(x, y, width, height, scrollOffset) {
  const cardPadding = 10;
  const cardWidth = (width - cardPadding * 3) / 2;
  const cardHeight = 120;
  const startY = 60 - scrollOffset;
  
  const totalCards = CREATURE_DATA.length;
  for (let i = 0; i < totalCards; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const left = cardPadding + col * (cardWidth + cardPadding);
    const top = startY + row * (cardHeight + cardPadding);
    
    if (x >= left && x <= left + cardWidth && y >= top && y <= top + cardHeight) {
      return CREATURE_DATA[i];
    }
  }
  
  // 检查返回按钮
  if (y < 50 && x < 80) {
    return {_type: 'back'};
  }
  
  return null;
}

// 打开生物详情弹窗
function drawDetailModal(ctx, width, height, creature) {
  // 半透明遮罩
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, width, height);
  
  const modalWidth = width - 40;
  const modalHeight = 300;
  const left = 20;
  const top = (height - modalHeight) / 2;
  
  // 弹窗背景
  ctx.fillStyle = '#0f2840';
  ctx.beginPath();
  ctx.roundRect(left, top, modalWidth, modalHeight, 16);
  ctx.fill();
  ctx.strokeStyle = creature.color;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 头部：圆形+名称
  const circleX = left + 50;
  const circleY = top + 50;
  ctx.fillStyle = creature.color;
  ctx.beginPath();
  ctx.arc(circleX, circleY, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(creature.emoji || creature.name[0], circleX, circleY);
  
  // 名称和来源
  ctx.textAlign = 'left';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(creature.name, left + 100, top + 35);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(creature.source, left + 100, top + 60);
  
  // 描述文字换行绘制
  ctx.font = '15px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  const textX = left + 20;
  let textY = top + 110;
  const lineHeight = 22;
  const maxWidth = modalWidth - 40;
  
  const words = creature.description.split('');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, textX, textY);
      line = words[i];
      textY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, textX, textY);
  
  // 关闭提示
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('点击关闭', width / 2, top + modalHeight - 20);
}

// 检查点击关闭详情
function isClickOnDetail(x, y, width, height) {
  const modalWidth = width - 40;
  const modalHeight = 300;
  const left = 20;
  const top = (height - modalHeight) / 2;
  
  if (x >= left && x <= left + modalWidth && y >= top && y <= top + modalHeight) {
    return false; // 点击在弹窗内不关闭
  }
  return true; // 点击遮罩关闭
}

// 计算内容总高度
function getHandbookTotalHeight() {
  const cardPadding = 10;
  const cardHeight = 120;
  const rows = Math.ceil(CREATURE_DATA.length / 2);
  return 60 + rows * (cardHeight + cardPadding);
}

// 导出 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    drawHandbook,
    drawDetailModal,
    getCardAtPoint,
    isClickOnDetail,
    getHandbookTotalHeight
  };
} else {
  // 浏览器环境，暴露到全局
  window.drawHandbook = drawHandbook;
  window.drawDetailModal = drawDetailModal;
  window.getCardAtPoint = getCardAtPoint;
  window.isClickOnDetail = isClickOnDetail;
  window.getHandbookTotalHeight = getHandbookTotalHeight;
}
