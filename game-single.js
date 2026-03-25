// 《海错图》国风合成微信小游戏 - 单文件版本
// 整合所有代码到一个文件，避免加载顺序问题

// ========== 1. 生物数据 ==========
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
  return CREATURES.find(function(c) { return c.level === level; });
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
  var colors = {
    '普通': '#FFFFFF',
    '优秀': '#88C0D0',
    '稀有': '#B48EAD',
    '传说': '#EBCB8B',
    '神话': '#BF616A'
  };
  return colors[rarity] || '#FFFFFF';
}

var CREATURE_DATA = {
  CREATURES: CREATURES,
  getCreatureByLevel: getCreatureByLevel,
  canMerge: canMerge,
  mergeResult: mergeResult,
  getRarityColor: getRarityColor
};

// ========== 2. 合成棋盘 ==========
function MergeBoard(size) {
  this.size = size || 5;
  this.grid = [];
  this.init();
}

MergeBoard.prototype.init = function() {
  this.grid = [];
  for (var r = 0; r < this.size; r++) {
    this.grid[r] = [];
    for (var c = 0; c < this.size; c++) {
      this.grid[r][c] = null;
    }
  }
};

MergeBoard.prototype.getEmptyCount = function() {
  var count = 0;
  for (var r = 0; r < this.size; r++) {
    for (var c = 0; c < this.size; c++) {
      if (!this.grid[r][c]) count++;
    }
  }
  return count;
};

MergeBoard.prototype.getEmptyPositions = function() {
  var positions = [];
  for (var r = 0; r < this.size; r++) {
    for (var c = 0; c < this.size; c++) {
      if (!this.grid[r][c]) {
        positions.push({ r: r, c: c });
      }
    }
  }
  return positions;
};

MergeBoard.prototype.spawnRandom = function(level) {
  level = level || 1;
  var empties = this.getEmptyPositions();
  if (empties.length === 0) return null;

  var randomIdx = Math.floor(Math.random() * empties.length);
  var pos = empties[randomIdx];
  var creature = CREATURE_DATA.getCreatureByLevel(level);
  this.grid[pos.r][pos.c] = {
    id: creature.id,
    level: creature.level,
    name: creature.name,
    color: creature.color,
    rarity: creature.rarity,
    description: creature.description,
    x: pos.c,
    y: pos.r
  };
  return { r: pos.r, c: pos.c, creature: this.grid[pos.r][pos.c] };
};

MergeBoard.prototype.isGameOver = function() {
  if (this.getEmptyCount() > 0) return false;

  for (var r = 0; r < this.size; r++) {
    for (var c = 0; c < this.size; c++) {
      var current = this.grid[r][c];
      if (!current) continue;

      if (c < this.size - 1 && this.grid[r][c + 1] &&
        this.grid[r][c + 1].level === current.level) {
        return false;
      }
      if (r < this.size - 1 && this.grid[r + 1][c] &&
        this.grid[r + 1][c].level === current.level) {
        return false;
      }
    }
  }
  return true;
};

MergeBoard.prototype.collapseDown = function() {
  var changed = false;

  for (var c = 0; c < this.size; c++) {
    var writePos = this.size - 1;
    for (var r = this.size - 1; r >= 0; r--) {
      if (this.grid[r][c]) {
        if (writePos !== r) {
          this.grid[writePos][c] = this.grid[r][c];
          this.grid[writePos][c].y = writePos;
          this.grid[r][c] = null;
          changed = true;
        }
        writePos--;
      }
    }
  }

  return changed;
};

MergeBoard.prototype.move = function(fromR, fromC, toR, toC) {
  if (!this.isValidPosition(toR, toC) || this.grid[toR][toC]) {
    return false;
  }

  this.grid[toR][toC] = this.grid[fromR][fromC];
  this.grid[toR][toC].y = toR;
  this.grid[toR][toC].x = toC;
  this.grid[fromR][fromC] = null;
  return true;
};

MergeBoard.prototype.isValidPosition = function(r, c) {
  return r >= 0 && r < this.size && c >= 0 && c < this.size;
};

MergeBoard.prototype.merge = function(fromR, fromC, toR, toC) {
  var a = this.grid[fromR][fromC];
  var b = this.grid[toR][toC];

  if (!a || !b) return null;
  if (!CREATURE_DATA.canMerge(a, b)) return null;

  var newCreature = CREATURE_DATA.mergeResult(a);
  var result = {
    id: newCreature.id,
    level: newCreature.level,
    name: newCreature.name,
    color: newCreature.color,
    rarity: newCreature.rarity,
    description: newCreature.description,
    x: toC,
    y: toR
  };
  this.grid[toR][toC] = result;
  this.grid[fromR][fromC] = null;

  return result;
};

MergeBoard.prototype.clear = function() {
  this.init();
};

MergeBoard.prototype.getAllCreatures = function() {
  var creatures = [];
  for (var r = 0; r < this.size; r++) {
    for (var c = 0; c < this.size; c++) {
      if (this.grid[r][c]) {
        creatures.push({
          id: this.grid[r][c].id,
          level: this.grid[r][c].level,
          name: this.grid[r][c].name,
          r: r, c: c
        });
      }
    }
  }
  return creatures;
};

// ========== 3. roundRect 兼容函数 ==========
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

// ========== 4. 渲染器 ==========
function Renderer(canvas, ctx, board) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.board = board;
  this.width = 0;
  this.height = 0;
  this.cellSize = 0;
  this.boardOffset = { x: 0, y: 0 };
}

Renderer.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
  this.canvas.width = width;
  this.canvas.height = height;

  var boardMaxSize = Math.min(width, height - 160);
  this.cellSize = Math.floor(boardMaxSize / this.board.size);
  var totalBoardSize = this.cellSize * this.board.size;

  this.boardOffset.x = Math.floor((width - totalBoardSize) / 2);
  this.boardOffset.y = 20;
};

Renderer.prototype.render = function(gameState) {
  var ctx = this.ctx;
  var width = this.width;
  var height = this.height;

  var gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a1929');
  gradient.addColorStop(1, '#001e3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  this.drawBubbles(ctx, width, height);

  if (gameState.currentScene === 'merge') {
    this.drawBoard();
    this.drawCreatures();
  } else if (gameState.currentScene === 'handbook') {
    gameState.handbook.render(ctx, width, height, gameState.unlockedCreatures);
  } else if (gameState.currentScene === 'fishing') {
    gameState.fishing.render(ctx, width, height);
  } else if (gameState.currentScene === 'garden') {
    gameState.garden.render(ctx, width, height);
  }

  this.drawTopUI(gameState);
  this.drawBottomNav(gameState);
};

Renderer.prototype.drawBubbles = function(ctx, width, height) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (var i = 0; i < 20; i++) {
    var x = Math.random() * width;
    var y = Math.random() * height;
    var r = Math.random() * 10 + 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
};

Renderer.prototype.drawBoard = function() {
  var offsetX = this.boardOffset.x;
  var offsetY = this.boardOffset.y;

  for (var r = 0; r < this.board.size; r++) {
    for (var c = 0; c < this.board.size; c++) {
      var cellX = offsetX + c * this.cellSize;
      var cellY = offsetY + r * this.cellSize;
      var padding = 4;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      roundRect(ctx, cellX + padding, cellY + padding,
        this.cellSize - padding * 2, this.cellSize - padding * 2, 8);
      ctx.fill();
    }
  }
};

Renderer.prototype.drawCreatures = function() {
  var offsetX = this.boardOffset.x;
  var offsetY = this.boardOffset.y;
  var padding = 4;

  for (var r = 0; r < this.board.size; r++) {
    for (var c = 0; c < this.board.size; c++) {
      var creature = this.board.grid[r][c];
      if (!creature) continue;

      var cellX = offsetX + c * this.cellSize;
      var cellY = offsetY + r * this.cellSize;
      var size = this.cellSize - padding * 2;

      this.drawCreatureCell(cellX + padding, cellY + padding, size, creature);
    }
  }
};

Renderer.prototype.drawCreatureCell = function(x, y, size, creature) {
  var rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

  var gradient = this.ctx.createRadialGradient(
    x + size / 2, y + size / 2, 0,
    x + size / 2, y + size / 2, size / 2
  );
  gradient.addColorStop(0, creature.color);
  gradient.addColorStop(1, rarityColor);

  this.ctx.fillStyle = gradient;
  this.ctx.beginPath();
  roundRect(this.ctx, x, y, size, size, 12);
  this.ctx.fill();

  this.ctx.strokeStyle = rarityColor;
  this.ctx.lineWidth = 2;
  this.ctx.stroke();

  this.ctx.fillStyle = '#1a1a1a';
  this.ctx.textAlign = 'center';
  this.ctx.font = 'bold ' + Math.floor(size / 5) + 'px sans-serif';
  this.ctx.fillText(creature.name, x + size / 2, y + size / 2 + 6);

  this.ctx.font = Math.floor(size / 8) + 'px sans-serif';
  this.ctx.fillText('Lv.' + creature.level, x + size / 2, y + size - 10);
};

Renderer.prototype.drawTopUI = function(gameState) {
  var boardBottom = this.boardOffset.y + this.board.size * this.cellSize;

  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  this.ctx.fillRect(10, boardBottom + 10, this.width - 20, 60);

  this.ctx.fillStyle = '#FFD700';
  this.ctx.font = 'bold 20px sans-serif';
  this.ctx.textAlign = 'left';
  this.ctx.fillText('饵料: ' + gameState.bait, 25, boardBottom + 48);

  this.ctx.fillStyle = '#ffffff';
  this.ctx.font = '14px sans-serif';
  this.ctx.textAlign = 'right';
  var hint = '';
  switch (gameState.currentScene) {
    case 'merge': hint = '拖动相同生物合成'; break;
    case 'handbook': hint = '海错图图鉴'; break;
    case 'fishing': hint = '每日奇遇'; break;
    case 'garden': hint = '海底小院'; break;
  }
  this.ctx.fillText(hint, this.width - 25, boardBottom + 48);
};

Renderer.prototype.drawBottomNav = function(gameState) {
  var navHeight = 60;
  var navY = this.height - navHeight - 10;
  var itemWidth = this.width / 4;

  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  this.ctx.fillRect(10, navY, this.width - 20, navHeight);

  var items = [
    { key: 'merge', name: '合成' },
    { key: 'handbook', name: '图鉴' },
    { key: 'fishing', name: '奇遇' },
    { key: 'garden', name: '小院' }
  ];

  var that = this;
  items.forEach(function(item, idx) {
    var itemX = 10 + idx * itemWidth;
    var isActive = gameState.currentScene === item.key;

    that.ctx.fillStyle = isActive ? 'rgba(100, 200, 255, 0.3)' : 'transparent';
    that.ctx.fillRect(itemX + 2, navY + 5, itemWidth - 6, navHeight - 10);

    that.ctx.fillStyle = isActive ? '#64C8FF' : '#aaaaaa';
    that.ctx.font = isActive ? 'bold 16px sans-serif' : '16px sans-serif';
    that.ctx.textAlign = 'center';
    that.ctx.fillText(item.name, itemX + itemWidth / 2, navY + navHeight / 2 + 6);
  });
};

Renderer.prototype.getGridPosition = function(clientX, clientY) {
  var offsetX = this.boardOffset.x;
  var offsetY = this.boardOffset.y;
  var c = Math.floor((clientX - offsetX) / this.cellSize);
  var r = Math.floor((clientY - offsetY) / this.cellSize);

  if (r >= 0 && r < this.board.size && c >= 0 && c < this.board.size) {
    return { r: r, c: c };
  }
  return null;
};

Renderer.prototype.getNavItem = function(clientX, clientY) {
  var navHeight = 60;
  var navY = this.height - navHeight - 10;

  if (clientY < navY || clientY > navY + navHeight) return null;

  var itemWidth = (this.width - 20) / 4;
  var idx = Math.floor((clientX - 10) / itemWidth);
  var items = ['merge', 'handbook', 'fishing', 'garden'];
  return items[idx] || null;
};

// ========== 5. 图鉴场景 ==========
function HandbookScene() {
  this.scrollOffset = 0;
  this.itemHeight = 120;
  this.cols = 2;
}

HandbookScene.prototype.render = function(ctx, width, height, unlockedCreatures) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('海错图图鉴', width / 2, 40);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(unlockedCreatures.length + '/30 已解锁', width / 2, 65);

  var startY = 80;
  var padding = 10;
  var itemWidth = (width - padding * (this.cols + 1)) / this.cols;

  var that = this;
  CREATURE_DATA.CREATURES.forEach(function(creature, idx) {
    var col = idx % that.cols;
    var row = Math.floor(idx / that.cols);
    var itemY = startY + row * that.itemHeight + that.scrollOffset;

    if (itemY + that.itemHeight < 80 || itemY > height - 80) return;

    var x = padding + col * (itemWidth + padding);
    var isUnlocked = unlockedCreatures.indexOf(creature.level) >= 0;

    if (isUnlocked) {
      var rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);
      var gradient = ctx.createLinearGradient(x, itemY, x + itemWidth, itemY + that.itemHeight);
      gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(1, 'rgba(' + that.hexToRgb(rarityColor) + ',0.2)');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
    }
    ctx.beginPath();
    roundRect(ctx, x, itemY, itemWidth, that.itemHeight - 10, 8);
    ctx.fill();

    if (isUnlocked) {
      that.drawUnlockedItem(ctx, x, itemY, itemWidth, creature);
    } else {
      that.drawLockedItem(ctx, x, itemY, itemWidth);
    }
  });

  if (unlockedCreatures.length === 30) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 恭喜集齐全部海错图生物！', width / 2, height - 90);
  }
};

HandbookScene.prototype.drawLockedItem = function(ctx, x, y, width) {
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('???', x + width / 2, y + this.itemHeight / 2 - 10);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '12px sans-serif';
  ctx.fillText('未解锁', x + width / 2, y + this.itemHeight / 2 + 15);
};

HandbookScene.prototype.drawUnlockedItem = function(ctx, x, y, width, creature) {
  var rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(creature.name