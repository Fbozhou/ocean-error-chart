// 《海错图》海洋生物数据 - 30级合成路径
const CREATURES = [
  // 1-10级：普通海洋生物
  {
    id: 1,
    level: 1,
    name: '磷虾',
    pinyin: 'lin xia',
    description: '海中小米，万千成群。虽为微物，亦是生命之基。',
    color: '#E8F4F8',
    rarity: '普通',
    image: null
  },
  {
    id: 2,
    level: 2,
    name: '小鱼',
    pinyin: 'xiao yu',
    description: '群游于水，来去自由。积鳞结队，以小博大。',
    color: '#B8E0F0',
    rarity: '普通',
    image: null
  },
  {
    id: 3,
    level: 3,
    name: '虾虎鱼',
    pinyin: 'xia hu yu',
    description: '《海错图》载：「虾虎鱼，状如鲇而小，色黄黑，居海窟中。」性好穴居，食肉小鱼。',
    color: '#88C0D0',
    rarity: '普通',
    image: null
  },
  {
    id: 4,
    level: 4,
    name: '花蛤',
    pinyin: 'hua ge',
    description: '壳如纹石，肉白而甘。潮汐退后，沙中藏身。',
    color: '#A3BE8C',
    rarity: '普通',
    image: null
  },
  {
    id: 5,
    level: 5,
    name: '螃蟹',
    pinyin: 'pang xie',
    description: '横行江湖，外刚内柔。八月蟹肥，味美无敌。',
    color: '#D08770',
    rarity: '普通',
    image: null
  },
  {
    id: 6,
    level: 6,
    name: '章鱼',
    pinyin: 'zhang yu',
    description: '八足缠绕，变色匿形。海中智多星，善变而灵。',
    color: '#B48EAD',
    rarity: '优秀',
    image: null
  },
  {
    id: 7,
    level: 7,
    name: '乌贼',
    pinyin: 'wu zei',
    description: '遇敌则喷墨自蔽，俗称墨斗鱼。《尔雅》谓之乌鲗，其骨入药。',
    color: '#8FBCBB',
    rarity: '优秀',
    image: null
  },
  {
    id: 8,
    level: 8,
    name: '带鱼',
    pinyin: 'dai yu',
    description: '身如白带，银鳞闪耀。肉细而鲜，海产之上品。',
    color: '#5E81AC',
    rarity: '优秀',
    image: null
  },
  {
    id: 9,
    level: 9,
    name: '黄鱼',
    pinyin: 'huang yu',
    description: '《海错图》：「黄鱼出水，金鳞照耀。」肉嫩味美，清明前后最佳。',
    color: '#EBCB8B',
    rarity: '优秀',
    image: null
  },
  {
    id: 10,
    level: 10,
    name: '海龟',
    pinyin: 'hai gui',
    description: '千年神龟，浮于沧海。背负山川，寿与天齐。',
    color: '#8FBCBB',
    rarity: '优秀',
    image: null
  },

  // 11-20级：稀有海洋生物
  {
    id: 11,
    level: 11,
    name: '海龙',
    pinyin: 'hai long',
    description: '《本草纲目》：「海龙生南海，马首蛇身，尾有翅。」强肾壮阳，药效如神。',
    color: '#4C566A',
    rarity: '稀有',
    image: null
  },
  {
    id: 12,
    level: 12,
    name: '海马',
    pinyin: 'hai ma',
    description: '《海错图》云：「海马，其状如马，浮于水面。」雄者育儿，世间奇事。',
    color: '#D08770',
    rarity: '稀有',
    image: null
  },
  {
    id: 13,
    level: 13,
    name: '玳瑁',
    pinyin: 'dai mao',
    description: '龟之美者，有玳瑁焉。文采交错，可为器饰。《海错图》称其「文采焕发」。',
    color: '#5E81AC',
    rarity: '稀有',
    image: null
  },
  {
    id: 14,
    level: 14,
    name: '鹦鹉鱼',
    pinyin: 'ying wu yu',
    description: '色彩斑斓，如鹦鹉之衣。夜则织网自卫，奇也。',
    color: '#88C0D0',
    rarity: '稀有',
    image: null
  },
  {
    id: 15,
    level: 15,
    name: '翻车鱼',
    pinyin: 'fan che yu',
    description: '形圆如磨，行动迟缓。体型巨大，却只食浮游生物。',
    color: '#616E88',
    rarity: '稀有',
    image: null
  },
  {
    id: 16,
    level: 16,
    name: '蝠鲼',
    pinyin: 'fu fen',
    description: '海中风筝，双翅如扇。浮游海面，悠然自得。',
    color: '#434C5E',
    rarity: '稀有',
    image: null
  },
  {
    id: 17,
    level: 17,
    name: '抹香鲸',
    pinyin: 'mo xiang jing',
    description: '鲸中之大者，能潜深海。肠中可得龙涎香，为香料之珍品。',
    color: '#3B4252',
    rarity: '稀有',
    image: null
  },
  {
    id: 18,
    level: 18,
    name: '大白鲨',
    pinyin: 'da bai sha',
    description: '海中霸王，牙齿如锯。群鱼皆畏，称霸大洋。',
    color: '#2E3440',
    rarity: '稀有',
    image: null
  },
  {
    id: 19,
    level: 19,
    name: '大王乌贼',
    pinyin: 'da wang wu zei',
    description: '深海巨物，传说中的海怪。巨足数十丈，可掀翻巨船。',
    color: '#2E3440',
    rarity: '稀有',
    image: null
  },
  {
    id: 20,
    level: 20,
    name: '皇带鱼',
    pinyin: 'huang dai yu',
    description: '身长数丈，如带漂浮。古称海龙王，地震先兆。',
    color: '#EBCB8B',
    rarity: '稀有',
    image: null
  },

  // 21-30级：山海经神兽
  {
    id: 21,
    level: 21,
    name: '赤鱬',
    pinyin: 'chi ru',
    description: '《山海经》：「青丘之山，其水出焉，而东流注于羿济，其中多赤鱬，其状如鱼而人面，其音如鸳鸯，食之不疥。」',
    color: '#BF616A',
    rarity: '传说',
    image: null
  },
  {
    id: 22,
    level: 22,
    name: '何罗鱼',
    pinyin: 'he luo yu',
    description: '《山海经》：「谯明之山，谯水出焉，西流注于河。其中多何罗之鱼，一首而十身，其音如吠犬，食之已痈。」',
    color: '#A3BE8C',
    rarity: '传说',
    image: null
  },
  {
    id: 23,
    level: 23,
    name: '鮨鱼',
    pinyin: 'yi yu',
    description: '《山海经》：「合水出于其阴，而北流注于泑水，多鮨鱼，鱼身而犬首，其音如婴儿，食之已狂。」',
    color: '#5E81AC',
    rarity: '传说',
    image: null
  },
  {
    id: 24,
    level: 24,
    name: '文鳐鱼',
    pinyin: 'wen yao yu',
    description: '《山海经》：「泰器之山，观水出焉，西流注于流沙。是多文鳐鱼，鱼身而鸟翼，苍文而白首赤喙，常行西海，游东海，夜飞。」',
    color: '#81A1C1',
    rarity: '传说',
    image: null
  },
  {
    id: 25,
    level: 25,
    name: '冉遗鱼',
    pinyin: 'ran yi yu',
    description: '《山海经》：「英鞮之山，涴水出焉，而北流注于陵羊之泽。是多冉遗之鱼，鱼身蛇首六足，其目如马耳，食之使人不眯，可以御凶。」',
    color: '#8FBCBB',
    rarity: '传说',
    image: null
  },
  {
    id: 26,
    level: 26,
    name: '鳛鳛鱼',
    pinyin: 'xi xi yu',
    description: '《山海经》：「涿山，洈水出焉，南流注于漳水。其中多鳛鳛鱼，其状如鳡而鸟翼，音如鸳鸯，见则其邑大水。」',
    color: '#B48EAD',
    rarity: '传说',
    image: null
  },
  {
    id: 27,
    level: 27,
    name: '珠鳖',
    pinyin: 'zhu bie',
    description: '《山海经》：「澧水出焉，东流注于海，其中多珠鳖鱼，其状如肺而有目，六足有珠，其味酸甘，食之无疠。」',
    color: '#D08770',
    rarity: '传说',
    image: null
  },
  {
    id: 28,
    level: 28,
    name: '玄龟',
    pinyin: 'xuan gui',
    description: '《山海经》：「怪水出焉，而东流注于宪翼之水。其中多玄龟，其状如龟而鸟首虺尾，其名曰旋龟，其音如劈木，佩之不聋，可以为底。」',
    color: '#4C566A',
    rarity: '传说',
    image: null
  },
  {
    id: 29,
    level: 29,
    name: '鲤鱼跃龙门',
    pinyin: 'li yu yue long men',
    description: '《三秦记》：「江海大鱼薄集龙门下，数千，不得上，上则为龙。」千年修炼，终得化龙。',
    color: '#EBCB8B',
    rarity: '神话',
    image: null
  },
  {
    id: 30,
    level: 30,
    name: '蛟龙',
    pinyin: 'jiao long',
    description: '《山海经》：「蛟，龙之属也。池鱼，满三千六百，蛟来为之长，能率鱼飞置笱水中，即蛟去。」兴云作雾，腾跃太空，终成正果。',
    color: '#BF616A',
    rarity: '神话',
    image: null
  }
];

// 根据等级找生物
function getCreatureByLevel(level) {
  return CREATURES.find(c => c.level === level);
}

// 合成规则：两个相同等级合成下一个等级
function canMerge(creature1, creature2) {
  return creature1.level === creature2.level && creature1.level < 30;
}

function mergeResult(creature) {
  return getCreatureByLevel(creature.level + 1);
}

// 根据 rarity 获取颜色
function getRarityColor(rarity) {
  const colors = {
    '普通': '#FFFFFF',
    '优秀': '#88C0D0',
    '稀有': '#B48EAD',
    '传说': '#EBCB8B',
    '神话': '#BF616A'
  };
  return colors[rarity] || '#FFFFFF';
}

// 导出
window.CREATURE_DATA = {
  CREATURES,
  getCreatureByLevel,
  canMerge,
  mergeResult,
  getRarityColor
};
