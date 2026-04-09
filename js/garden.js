/**
 * 海错图 - 海底小院场景
 * 20级以上神兽可以放进来展示饲养
 */

// 默认小院配置：4个槽位
const DEFAULT_SLOTS = [
  { id: 0, unlocked: true, creatureId: null },
  { id: 1, unlocked: false, cost: 1000, creatureId: null },
  { id: 2, unlocked: false, cost: 3000, creatureId: null },
  { id: 3, unlocked: false, cost: 5000, creatureId: null }
];

// 判断是否可以放置
function canPlaceCreature(creatureId) {
  const creature = getCreatureById(creatureId);
  // 20级以上才能放小院
  return creature && creature.level >= 20;
}

// 获取可放置列表
function getPlaceableCreatures(unlockedIds) {
  return unlockedIds
    .map(id => getCreatureById(id))
    .filter(c => canPlaceCreature(c.id));
}

// 绘制海底小院
function drawGarden(ctx, width, height, slots, unlockedCreatures) {
  // 背景水泡
  drawBubbles(ctx, width, height, Date.now());
  
  // 标题栏
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, width, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('海底小院', width / 2, 30);
  
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('↩ 返回游戏', 16, 32);
  
  // 说明
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('20级以上神兽可展示', width - 16, 32);
  
  // 绘制槽位
  const slotSize = Math.min((width - 60) / 2, 160);
  const padding = 20;
  const startY = 80;
  
  slots.forEach((slot, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const left = padding + col * (slotSize + padding);
    const top = startY + row * (slotSize + padding);
    
    // 槽位背景
    if (slot.unlocked) {
      if (slot.creatureId) {
        const creature = getCreatureById(slot.creatureId);
        ctx.fillStyle = creature.color + '88';
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
      }
      ctx.beginPath();
      ctx.roundRect(left, top, slotSize, slotSize, 12);
      ctx.fill();
      
      if (slot.creatureId) {
        const creature = getCreatureById(slot.creatureId);
        // 绘制神兽
        const centerX = left + slotSize / 2;
        const centerY = top + slotSize / 2;
        const radius = slotSize * 0.35;
        
        ctx.fillStyle = creature.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.font = `${radius * 0.8}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(creature.emoji || creature.name[0], centerX, centerY);
        
        // 名称
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(creature.name, centerX, top + slotSize + 18);
      } else {
        // 空槽位提示
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '14px';
        ctx.textAlign = 'center';
        ctx.fillText('空槽位', left + slotSize / 2, top + slotSize / 2);
        ctx.fillText('点击放置神兽', left + slotSize / 2, top + slotSize / 2 + 20);
      }
    } else {
      // 未解锁
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.roundRect(left, top, slotSize, slotSize, 12);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '14px';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', left + slotSize / 2, top + slotSize / 2 - 10);
      ctx.fillText(`${slot.cost}积分`, left + slotSize / 2, top + slotSize / 2 + 15);
    }
  });
  
  // 蹭饭提示
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px';
  ctx.textAlign = 'center';
  ctx.fillText('分享给好友可以互相蹭饵料哦', width / 2, height - 30);
}

// 检查点击
function getClickedSlot(x, y, width, height, slots) {
  const slotSize = Math.min((width - 60) / 2, 160);
  const padding = 20;
  const startY = 80;
  
  // 返回按钮
  if (y < 50 && x < 80) {
    return {type: 'back'};
  }
  
  for (let i = 0; i < slots.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const left = padding + col * (slotSize + padding);
    const top = startY + row * (slotSize + padding);
    
    if (x >= left && x <= left + slotSize && y >= top && y <= top + slotSize) {
      return {type: 'slot', slot: slots[i]};
    }
  }
  
  return null;
}

// 绘制选择神兽弹窗
function drawSelectModal(ctx, width, height, placeableCreatures) {
  // 遮罩
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, width, height);
  
  const modalHeight = 250;
  const top = height - modalHeight - 20;
  const left = 20;
  const right = width - 20;
  const w = right - left;
  
  ctx.fillStyle = '#0f2840';
  ctx.beginPath();
  ctx.roundRect(left, top, w, modalHeight, 16);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px';
  ctx.textAlign = 'left';
  ctx.fillText('选择要展示的神兽', left + 10, top + 30);
  
  // 绘制可选择列表
  const itemHeight = 50;
  const startY = top + 50;
  placeableCreatures.forEach((creature, index) => {
    const itemTop = startY + index * itemHeight;
    ctx.fillStyle = creature.color + '44';
    ctx.beginPath();
    ctx.roundRect(left + 5, itemTop, w - 10, itemHeight - 5, 8);
    ctx.fill();
    
    // 图标
    ctx.fillStyle = creature.color;
    ctx.beginPath();
    ctx.arc(left + 30, itemTop + 22, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(creature.emoji || creature.name[0], left + 30, itemTop + 22);
    
    // 名称
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px';
    ctx.textAlign = 'left';
    ctx.fillText(creature.name, left + 70, itemTop + 27);
    // 等级
    ctx.font = '12px';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`Lv.${creature.level}`, left + 70, itemTop + 42);
  });
  
  if (placeableCreatures.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px';
    ctx.textAlign = 'center';
    ctx.fillText('没有可放置的神兽，先去合成到20级吧', width / 2, top + 125);
  }
  
  // 关闭提示
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '14px';
  ctx.textAlign = 'center';
  ctx.fillText('点击空白处关闭', width / 2, top + modalHeight - 15);
}

// 检查选择点击
function getSelectedCreature(x, y, width, height, placeableCreatures) {
  const modalHeight = 250;
  const top = height - modalHeight - 20;
  const left = 20;
  const itemHeight = 50;
  const startY = top + 50;
  
  if (y < top) {
    return 'close';
  }
  
  for (let i = 0; i < placeableCreatures.length; i++) {
    const itemTop = startY + i * itemHeight;
    if (y >= itemTop && y <= itemTop + itemHeight) {
      return placeableCreatures[i];
    }
  }
  
  return 'close';
}

// 导出 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    DEFAULT_SLOTS,
    canPlaceCreature,
    getPlaceableCreatures,
    drawGarden,
    getClickedSlot,
    drawSelectModal,
    getSelectedCreature
  };
} else {
  // 浏览器环境，暴露到全局
  window.DEFAULT_SLOTS = DEFAULT_SLOTS;
  window.canPlaceCreature = canPlaceCreature;
  window.getPlaceableCreatures = getPlaceableCreatures;
  window.drawGarden = drawGarden;
  window.getClickedSlot = getClickedSlot;
  window.drawSelectModal = drawSelectModal;
  window.getSelectedCreature = getSelectedCreature;
}
