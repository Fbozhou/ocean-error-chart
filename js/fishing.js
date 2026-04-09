/**
 * 海错图 - 每日钓鱼奇遇系统
 * 每天三次免费钓鱼，随机获得饵料和生物
 */

// 钓鱼奖励池
const FISHING_REWARDS = [
  { type: 'bait', name: '普通饵料', value: 10, probability: 0.3 },
  { type: 'bait', name: '高级饵料', value: 30, probability: 0.15 },
  { type: 'creature', level: 1, probability: 0.2 },
  { type: 'creature', level: 3, probability: 0.15 },
  { type: 'creature', level: 5, probability: 0.1 },
  { type: 'creature', level: 8, probability: 0.08 },
  { type: 'creature', level: 10, probability: 0.02 },
];

// 随机抽取奖励
function drawReward() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const reward of FISHING_REWARDS) {
    cumulative += reward.probability;
    if (rand <= cumulative) {
      if (reward.type === 'creature') {
        const creature = CREATURE_DATA.find(c => c.level === reward.level);
        return {
          type: 'creature',
          creature: creature,
          name: creature.name
        };
      } else {
        return reward;
      }
    }
  }
  
  // 默认返回最低奖励
  return FISHING_REWARDS[0];
}

// 绘制钓鱼场景
function drawFishing(ctx, width, height, remainingCount, isCasting, progress, result) {
  // 背景
  drawBubbles(ctx, width, height, Date.now());
  
  // 标题
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, width, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('每日钓鱼奇遇', width / 2, 30);
  
  // 返回提示
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('↩ 返回游戏', 16, 32);
  
  // 剩余次数
  ctx.textAlign = 'right';
  ctx.fillText(`今日剩余: ${remainingCount}/3`, width - 16, 32);
  
  // 钓鱼提示区域
  const centerY = height / 2;
  
  if (!isCasting && !result) {
    // 未抛竿状态
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 100, centerY - 80, 200, 120, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('点击抛竿钓鱼', width / 2, centerY - 20);
    ctx.font = '14px';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('有概率钓得稀有生物', width / 2, centerY + 10);
    ctx.fillText('每日0点重置次数', width / 2, centerY + 35);
  } else if (isCasting) {
    // 钓鱼中...
    const bobberX = width / 2 + Math.sin(Date.now() / 200) * 20;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 100);
    ctx.quadraticCurveTo(width / 2, centerY - 50, bobberX, centerY - 20);
    ctx.stroke();
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bobberX, centerY - 20, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px';
    ctx.textAlign = 'center';
    ctx.fillText(`沉水中... ${Math.round(progress * 100)}%`, width / 2, centerY + 40);
    
    // 进度条
    const barWidth = 200;
    const barHeight = 10;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect((width - barWidth) / 2, centerY + 60, barWidth, barHeight);
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect((width - barWidth) / 2, centerY + 60, barWidth * progress, barHeight);
  } else if (result) {
    // 钓鱼结果
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 120, centerY - 100, 240, 180, 12);
    ctx.fill();
    
    if (result.type === 'creature') {
      const creature = result.creature;
      // 绘制生物图标
      ctx.fillStyle = creature.color;
      ctx.beginPath();
      ctx.arc(width / 2, centerY - 30, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(creature.emoji || creature.name[0], width / 2, centerY - 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px';
      ctx.textAlign = 'center';
      ctx.fillText(`恭喜钓得`, width / 2, centerY + 30);
      ctx.fillStyle = creature.color;
      ctx.fillText(creature.name, width / 2, centerY + 60);
    } else {
      // 饵料奖励
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width / 2, centerY - 30, 40, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = '36px';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.fillText('🥫', width / 2, centerY - 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px';
      ctx.textAlign = 'center';
      ctx.fillText(`获得`, width / 2, centerY + 30);
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`${result.value} ${result.name}`, width / 2, centerY + 60);
    }
  }
  
  // 提示
  if (remainingCount === 0 && !result) {
    ctx.fillStyle = 'rgba(255,200,0,0.8)';
    ctx.font = 'bold 16px';
    ctx.textAlign = 'center';
    ctx.fillText('今日次数已用完，明天再来吧', width / 2, height - 80);
  }
}

// 检查点击返回
function checkClick(x, y) {
  if (y < 50 && x < 80) {
    return 'back';
  }
  
  if (y < 50) {
    return null;
  }
  
  return 'cast'; // 点击抛竿
}

// 导出 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    FISHING_REWARDS,
    drawFishing,
    drawReward,
    checkClick
  };
} else {
  // 浏览器环境，暴露到全局
  window.FISHING_REWARDS = FISHING_REWARDS;
  window.drawFishing = drawFishing;
  window.drawReward = drawReward;
  window.checkClick = checkClick;
  window.drawReward = drawReward;
}
