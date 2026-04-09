/**
 * 海错图 - 生物数据
 * 总共30级，从1级磷虾到30级蛟龙
 */

const CREATURE_DATA = [
  // 1-10: 普通海洋生物
  {
    id: 1,
    level: 1,
    name: '磷虾',
    color: '#87CEEB',
    emoji: '🦐',
    description: '小小的磷虾，成群结队在海中漂流，是鲸鱼最爱的零食。',
    source: '海洋常见生物'
  },
  {
    id: 2,
    level: 2,
    name: '小鱼',
    color: '#4FC3F7',
    emoji: '🐟',
    description: '银闪闪的小鱼，在海草间穿梭游动，灵活得很。',
    source: '海洋常见生物'
  },
  {
    id: 3,
    level: 3,
    name: '小螃蟹',
    color: '#FF7043',
    emoji: '🦀',
    description: '横着走的小螃蟹，一对钳子举得老高，没人敢惹。',
    source: '海洋常见生物'
  },
  {
    id: 4,
    level: 4,
    name: '海葵',
    color: '#F06292',
    emoji: '🪸',
    description: '像花儿一样盛开在礁石上，花瓣其实是捕捉猎物的触手。',
    source: '海洋常见生物'
  },
  {
    id: 5,
    level: 5,
    name: '海星',
    color: '#FF8A65',
    emoji: '⭐',
    description: '五角星形状的海星，就算断了腕也能重新长出来。',
    source: '海洋常见生物'
  },
  {
    id: 6,
    level: 6,
    name: '扇贝',
    color: '#B0BEC5',
    emoji: '贝壳',
    description: '雪白的贝壳，里面偶尔能养出圆润的珍珠。',
    source: '海洋常见生物'
  },
  {
    id: 7,
    level: 7,
    name: '八爪鱼',
    color: '#78909C',
    emoji: '🐙',
    description: '八个灵活的触手，能轻松钻进瓶子里捉迷藏。',
    source: '海洋常见生物'
  },
  {
    id: 8,
    level: 8,
    name: '龙虾',
    color: '#D32F2F',
    emoji: '🦞',
    description: '身披红铠甲，大钳子威武有力，海鲜界的硬骨头。',
    source: '海洋常见生物'
  },
  {
    id: 9,
    level: 9,
    name: '海参',
    color: '#8D6E63',
    emoji: '海肠',
    description: '软绵绵黑乎乎，遇到危险就吐出内脏吓跑敌人。',
    source: '海洋常见生物'
  },
  {
    id: 10,
    level: 10,
    name: '石斑鱼',
    color: '#689F38',
    emoji: '🐠',
    description: '大块头的石斑鱼，肉质鲜美，是海中的美味。',
    source: '海洋常见生物'
  },

  // 11-20: 稀有海洋生物
  {
    id: 11,
    level: 11,
    name: '小丑鱼',
    color: '#FFB74D',
    emoji: '🐡',
    description: '橙白相间的小丑鱼，和海葵是好朋友，住在它的触手间。',
    source: '海洋稀有生物'
  },
  {
    id: 12,
    level: 12,
    name: '海龟',
    color: '#4CAF50',
    emoji: '🐢',
    description: '长寿的海龟，背着重重的壳，能活上几百年。',
    source: '海洋稀有生物'
  },
  {
    id: 13,
    level: 13,
    name: '水母',
    color: '#B2EBF2',
    emoji: '💧',
    description: '飘逸美丽的水母，透明的伞状体下藏着毒刺。',
    source: '海洋稀有生物'
  },
  {
    id: 14,
    level: 14,
    name: '珊瑚',
    color: '#E91E63',
    emoji: '🪸',
    description: '五彩斑斓的珊瑚礁，是成千上万小鱼的家。',
    source: '海洋稀有生物'
  },
  {
    id: 15,
    level: 15,
    name: '海豚',
    color: '#607D8B',
    emoji: '🐬',
    description: '聪明伶俐的海豚，会跳出海面跳舞，还能救人。',
    source: '海洋稀有生物'
  },
  {
    id: 16,
    level: 16,
    name: '大王乌贼',
    color: '#303030',
    emoji: '🐙',
    description: '传说中的深海巨怪，几十米长的身躯，能和巨鲸搏斗。',
    source: '深海传说'
  },
  {
    id: 17,
    level: 17,
    name: '大白鲨',
    color: '#212121',
    emoji: '🦈',
    description: '海洋顶端的捕食者，血盆大口一出，鱼儿纷纷逃窜。',
    source: '海洋稀有生物'
  },
  {
    id: 18,
    level: 18,
    name: '魔鬼鱼',
    color: '#424242',
    emoji: '𫚉鱼',
    description: '像蝙蝠一样在水中飞翔，扁平的身体，尾巴带着毒刺。',
    source: '海洋稀有生物'
  },
  {
    id: 19,
    level: 19,
    name: '抹香鲸',
    color: '#5D4037',
    emoji: '🐳',
    description: '地球上最大的牙齿动物，潜到深海大战大王乌贼。',
    source: '海洋稀有生物'
  },
  {
    id: 20,
    level: 20,
    name: '帝王蟹',
    color: '#BF360C',
    emoji: '🦀',
    description: '深海帝王，腿比人的手臂还长，肉质饱满鲜甜。',
    source: '海鲜至尊'
  },

  // 21-29: 山海经神兽
  {
    id: 21,
    level: 21,
    name: '赤鱬',
    color: '#FF80AB',
    emoji: '🧜',
    description: '赤鱬状如鱼而人面，其音如鸳鸯，食之不疥。生活在青丘山中的涣水。',
    source: '《山海经·南山经》'
  },
  {
    id: 22,
    level: 22,
    name: '何罗鱼',
    color: '#4FC3F7',
    emoji: '🐙',
    description: '何罗之鱼，一首而十身，一身十首，能分能合，变化无穷。',
    source: '《山海经·北山经》'
  },
  {
    id: 23,
    level: 23,
    name: '文鳐鱼',
    color: '#90CAF9',
    emoji: '🐟',
    description: '文鳐鱼状如鲤里，鱼身而鸟翼，苍文而白首赤喙，常行西海，游东海，夜飞而溯沧溟。',
    source: '《山海经·西山经》'
  },
  {
    id: 24,
    level: 24,
    name: '冉遗鱼',
    color: '#9575CD',
    emoji: '🐉',
    description: '冉遗鱼鱼身蛇首六足，其目如马耳，食之使人不眯，可以御凶。',
    source: '《山海经·西山经》'
  },
  {
    id: 25,
    level: 25,
    name: '鮨鱼',
    color: '#81D4FA',
    emoji: '🐺',
    description: '鮨鱼鱼身而犬首，其音如婴儿，食之已狂。',
    source: '《山海经·北山经》'
  },
  {
    id: 26,
    level: 26,
    name: '滑鱼',
    color: '#4DD0E1',
    emoji: '🐟',
    description: '滑鱼状如鳜，居坻，而赤鳞，其音如叱吟，食之已疣。',
    source: '《山海经·北山经》'
  },
  {
    id: 27,
    level: 27,
    name: '𩽾𩾌',
    color: '#6D4C41',
    emoji: '🎣',
    description: '𩽾𩾌，头大口阔，背有刺，腹有垂，其垂如笼，诱小鱼而食之。《海错图》载：“网得𩽾𩾌，其口可容一人。”',
    source: '《海错图》'
  },
  {
    id: 28,
    level: 28,
    name: '鳌鱼',
    color: '#546E7A',
    emoji: '🐲',
    description: '海中大鳌，负蓬莱山而摈沧海之间，传说顶天立地，背负仙山。',
    source: '古代神话'
  },
  {
    id: 29,
    level: 29,
    name: '鲲鹏',
    color: '#1976D2',
    emoji: '🦅',
    description: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。背若泰山，翼若垂天之云。',
    source: '《庄子·逍遥游》'
  },

  // 30: 终极神兽
  {
    id: 30,
    level: 30,
    name: '蛟龙',
    color: '#1A237E',
    emoji: '🐉',
    description: '蛟，龙之属也。虺五百年化为蛟，蛟千年化为龙。潜于深渊，兴云作雨，是万物之灵长，水族之至尊。',
    source: '《山海经》·终极神兽'
  }
];

// 获取合成公式：两个level相同的合成level+1
function getNextLevel(currentLevel) {
  return currentLevel + 1;
}

// 根据id获取生物数据
function getCreatureById(id) {
  return CREATURE_DATA.find(c => c.id === id);
}

// 根据等级获取所有生物
function getCreaturesByLevel(level) {
  return CREATURE_DATA.filter(c => c.level === level);
}

// 获取最大等级
function getMaxLevel() {
  return Math.max(...CREATURE_DATA.map(c => c.level));
}

// 更新数据（后端合并用）
function updateFromBackend(newData) {
  if (Array.isArray(newData)) {
    CREATURE_DATA = newData;
  }
}

// 导出接口 - 兼容node模块和浏览器全局
if (typeof module !== 'undefined') {
  module.exports = {
    CREATURE_DATA,
    getNextLevel,
    getCreatureById,
    getCreaturesByLevel,
    getMaxLevel,
    updateFromBackend
  };
} else {
  // 浏览器环境，暴露到全局
  window.CREATURE_DATA = CREATURE_DATA;
  window.getNextLevel = getNextLevel;
  window.getCreatureById = getCreatureById;
  window.getCreaturesByLevel = getCreaturesByLevel;
  window.getMaxLevel = getMaxLevel;
  window.updateFromBackend = updateFromBackend;
}
