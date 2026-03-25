// 《海错图》国风合成微信小游戏
// 单文件版本 - 避免微信小游戏加载顺序问题

// ========== 工具函数: roundRect ==========
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

// ========== 1. 生物数据定义 ==========
var CREATURES = [
  { id: 1, level: 1, name: '磷虾', description: '海中小米，万千成群。虽为微物，亦是生命之基。', color: '#E8F4F8', rarity: '普通' },
  { id: 2, level: 2, name: '小鱼', description: '群游于水，来去自由。积鳞结队，以小博大。', color: '#B8E0F0', rarity: '普通' },
  { id: 3, level: 3, name: '虾虎鱼', description: '《海错图》载：「虾虎鱼，状如鲇而小，色黄黑，居海窟中。」性好穴居，食肉小鱼。', color: '#88C0D0', rarity: '普通' },
  { id: 4, level: 4, name: '花蛤', description: '壳如纹石，肉白而甘。潮汐退后，沙中藏身。', color: '#A3BE8C', rarity: '普通' },
  { id: 5, level: 5, name: '螃蟹', description: '横行江湖，外刚内柔。八月蟹肥，味美无敌。', color: '#D08770', rarity: '普通' },
  { id: 6, level: 6, name: '章鱼', description: '八足缠绕，变色匿形。海中智多星，善变而灵。', color: '#B48EAD', rarity: '优秀' },
  { id: 7, level: 7, name: '乌贼', description: '遇敌则喷墨自蔽，俗称墨斗鱼。《尔雅》谓之乌鲗，其骨入药。', color: '#8FBCBB', rarity: '优秀' },
  { id: 8, level: 8, name: '带鱼', description: '身如白带，银鳞闪耀。肉细而鲜，海产之上品。', color: '#5E81AC', rarity: '优秀' },
  { id: 9, level: 9, name: '黄鱼', description: '《海错图》：「黄鱼出水，金鳞照耀。」肉嫩味美，清明前后最佳。', color: '#EBCB8B', rarity: '优秀' },
  { id: 10, level: 10, name: '海龟', description: '千年神龟，浮于沧海。背负山川，寿与天齐。', color: '#8FBCBB', rarity: '优秀' },
  { id: 11, level: 11, name: '海龙', description: '《本草纲目》：「海龙生南海，马首蛇身，尾有翅。」强肾壮阳，药效如神。', color: '#4C566A', rarity: '稀有' },
  { id: 12, level: 12, name: '海马', description: '《海错图》云：「海马，其状如马，浮于水面。」雄者育儿，世间奇事。', color: '#D08770', rarity: '稀有' },
  { id: 13, level: 13, name: '玳瑁', description: '龟之美者，有玳瑁焉。文采交错，可为器饰。《海错图》称其「文采焕发」。', color: '#5E81AC', rarity: '稀有' },
  { id: 14, level: 14, name: '鹦鹉鱼', description: '色彩斑斓，如鹦鹉之衣。夜则织网自卫，奇也。', color: '#88C0D0', rarity: '稀有' },
  { id: 15, level: 15, name: '翻车鱼', description: '形圆如磨，行动迟缓。体型巨大，却只食浮游生物。', color: '#616E88', rarity: '稀有' },
  { id: 16, level: 16, name: '蝠鲼', description: '海中风筝，双翅如扇。浮游海面，悠然自得。', color: '#434C5E', rarity: '稀有' },
  { id: 17, level: 17, name: '抹香鲸', description: '鲸中之大者，能潜深海。肠中可得龙涎香，为香料之珍品。', color: '#3B4252', rarity: '稀有' },
  { id: 18, level: 18, name: '大白鲨', description: '海中霸王，牙齿如锯。群鱼皆畏，称霸大洋。', color: '#2E3440', rarity: '稀有' },
  { id: 19, level: 19, name: '大王乌贼', description: '深海巨物，传说中的海怪。巨足数十丈，可掀翻巨船。', color: '#2E3440', rarity: '稀有' },
  { id: 20, level: 20, name: '皇带鱼', description: '身长数丈，如带漂浮。古称海龙王，地震先兆。', color: '#EBCB8B', rarity: '稀有' },
  { id: 21, level: 21, name: '赤鱬', description: '《山海经》：「青丘之山，其水出焉，而东流注于羿济，其中多赤鱬，其状如鱼而人面，其音如鸳鸯，食之不疥。」', color: '#BF616A', rarity: '传说' },
  { id: 22, level: 22, name: '何罗鱼', description: '《山海经》：「谯明之山，谯水出焉，西流注于河。其中多何罗之鱼，一首而十身，其音如吠犬，食之已痈。」', color: '#A3BE8C', rarity: '传说' },
  { id: 23, level: 23, name: '鮨鱼', description: '《山海经》：「合水出于其阴，而北流注于泑水，多鮨鱼，鱼身而犬首，其音如婴儿，食之已狂。」', color: '#5E81AC', rarity: '传说' },
  { id: 24, level: 24, name: '文鳐鱼', description: '《山海经》：「泰器之山，观水出焉，西流注于流沙。是多文鳐鱼，鱼身而鸟翼，苍文而白首赤喙，常行西海，游东海，夜飞。」', color: '#81A1C1', rarity: '传说' },
  { id: 25, level: 25, name: '冉遗鱼', description: '《山海经》：「英鞮之山，涴水出焉，而北流注于陵羊之泽。是多冉遗之鱼，鱼身蛇首六足，其目如马耳，食之使人不眯，可以御凶。」', color: '#8FBCBB', rarity: '传说' },
  { id: 26, level: 26, name: '鳛鳛鱼', description: '《山海经》：「涿山，洈水出焉，南流注于漳水。其中多鳛鳛鱼，其状如鳡而鸟翼，音如鸳鸯，见则其邑大水。」', color: '#B48EAD', rarity: '传说' },
  { id: 27, level: 27, name: '珠鳖', description: '《山海经》：「澧水出焉，东流注于海，其中多珠鳖鱼，其状如肺而有目，六足有珠，其味酸甘，食之无疠。」', color: '#D08770', rarity: '传说' },
  { id: 28, level: 28, name: '玄龟', description: '《山海经》：「怪水出焉，而东流注于宪翼之水。其中多玄龟，其状如龟而鸟首虺尾，其名曰旋龟，其音如劈木，佩之不聋，可以为底。」', color: '#4C566A', rarity: '传说' },
  { id: 29, level: 29, name: '鲤鱼跃龙门', description: '《三秦记》：「江海大鱼薄集龙门下，数千，不得上，上则为龙。」千年修炼，终得化龙。', color: '#EBCB8B', rarity: '神话' },
  { id: 30, level: 30, name: '蛟龙', description: '《山海经》：「蛟，龙之属也。池鱼，满三千六百，蛟来为之长，能率鱼飞置笱水中，即蛟去。」兴云作雾，腾跃太空，终成正果。', color: '#BF616A', rarity: '神话' }
];

function getCreatureByLevel(level) {
  for (var i = 0; i < CREATURES.length; i++) {
    if (CREATURES[i].level === level) return CREATURES[i];
  }
  return null;
}

function canMerge(creature1, creature2) {
  return creature1.level === creature2.level && creature1.level < 30;
}

function mergeResult(creature) {
  return getCreatureByLevel(creature.level + 1);
}

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

// ========== 2. 合成棋盘类 ==========
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
      if (!this.grid[r][c]) positions.push({ r: r, c: c });
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
  var creatureData = CREATURE_DATA.getCreatureByLevel(level);
  this.grid[pos.r][pos.c] = {
    id: creatureData.id,
    level: creatureData.level,
    name: creatureData.name,
    color: creatureData.color,
    rarity: creatureData.rarity,
    description: creatureData.description,
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

  var newCreatureData = CREATURE_DATA.mergeResult(a);
  var newCreature = {
    id: newCreatureData.id,
    level: newCreatureData.level,
    name: newCreatureData.name,
    color: newCreatureData.color,
    rarity: newCreatureData.rarity,
    description: newCreatureData.description,
    x: toC,
    y: toR
  };
  this.grid[toR][toC] = newCreature;
  this.grid[fromR][fromC] = null;

  return newCreature;
};

MergeBoard.prototype.clear = function() {
  this.init();
};

// ========== 3. 渲染器 ==========
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

Renderer.prototype.render = function(game) {
  var ctx = this.ctx;
  var width = this.width;
  var height = this.height;

  var gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a1929');
  gradient.addColorStop(1, '#001e3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  this.drawBubbles(ctx, width, height);

  if (game.currentScene === 'merge') {
    this.drawBoard();
    this.drawCreatures();
  } else if (game.currentScene === 'handbook') {
    game.handbook.render(ctx, width, height, game.unlockedCreatures);
  } else if (game.currentScene === 'fishing') {
    game.fishing.render(ctx, width, height);
  } else if (game.currentScene === 'garden') {
    game.garden.render(ctx, width, height);
  }

  this.drawTopUI(game);
  this.drawBottomNav(game);
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

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.beginPath();
      roundRect(this.ctx, cellX + padding, cellY + padding,
        this.cellSize - padding * 2, this.cellSize - padding * 2, 8);
      this.ctx.fill();
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

Renderer.prototype.drawTopUI = function(game) {
  var boardBottom = this.boardOffset.y + this.board.size * this.cellSize;

  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  this.ctx.fillRect(10, boardBottom + 10, this.width - 20, 60);

  this.ctx.fillStyle = '#FFD700';
  this.ctx.font = 'bold 20px sans-serif';
  this.ctx.textAlign = 'left';
  this.ctx.fillText('饵料: ' + game.bait, 25, boardBottom + 48);

  this.ctx.fillStyle = '#ffffff';
  this.ctx.font = '14px sans-serif';
  this.ctx.textAlign = 'right';
  var hint = '';
  switch (game.currentScene) {
    case 'merge': hint = '拖动相同生物合成'; break;
    case 'handbook': hint = '海错图图鉴'; break;
    case 'fishing': hint = '每日奇遇'; break;
    case 'garden': hint = '海底小院'; break;
  }
  this.ctx.fillText(hint, this.width - 25, boardBottom + 48);
};

Renderer.prototype.drawBottomNav = function(game) {
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
    var isActive = game.currentScene === item.key;

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

// ========== 4. 图鉴场景 ==========
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
  ctx.fillText(creature.name, x + 12, y + 25);

  ctx.fillStyle = rarityColor;
  ctx.font = '12px sans-serif';
  ctx.fillText(creature.rarity + ' · Lv.' + creature.level, x + 12, y + 42);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '12px sans-serif';
  this.wrapText(ctx, creature.description, x + 10, y + 60, width - 20, 16);
};

HandbookScene.prototype.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split('');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n];
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
};

HandbookScene.prototype.hexToRgb = function(hex) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return r + ', ' + g + ', ' + b;
};

HandbookScene.prototype.handleTouchMove = function(deltaY) {
  this.scrollOffset += deltaY;
  var totalRows = Math.ceil(CREATURE_DATA.CREATURES.length / this.cols);
  var maxScroll = -(totalRows * this.itemHeight - (this.getHeight() - 120));
  this.scrollOffset = Math.min(0, Math.max(maxScroll, this.scrollOffset));
};

HandbookScene.prototype.getHeight = function() {
  return wx.getSystemInfoSync().windowHeight;
};

// ========== 5. 每日钓鱼 ==========
function FishingScene() {
  this.state = 'idle'; // idle -> casting -> pulling -> result
  this.castingProgress = 0;
  this.result = null;
  this.freeCount = 3;
}

FishingScene.prototype.resetDaily = function(freeCount) {
  this.freeCount = freeCount || 3;
  this.state = 'idle';
  this.result = null;
};

FishingScene.prototype.cast = function() {
  if (this.freeCount <= 0) {
    wx.showToast({
      title: '今日次数已用完',
      icon: 'none'
    });
    return false;
  }

  this.state = 'casting';
  this.castingProgress = 0;
  this.freeCount--;
  return true;
};

FishingScene.prototype.update = function() {
  if (this.state === 'casting') {
    this.castingProgress += 2;
    if (this.castingProgress >= 100) {
      this.pull();
    }
  }
};

FishingScene.prototype.pull = function() {
  var rand = Math.random();
  if (rand < 0.6) {
    this.result = { type: 'bait', amount: 50 + Math.floor(Math.random() * 100) };
  } else if (rand < 0.9) {
    var level = 1 + Math.floor(Math.random() * 10);
    var creature = CREATURE_DATA.getCreatureByLevel(level);
    this.result = { type: 'creature', creature: creature };
  } else {
    var level = 10 + Math.floor(Math.random() * 15);
    var creature = CREATURE_DATA.getCreatureByLevel(level);
    this.result = { type: 'creature', creature: creature };
  }
  this.state = 'result';
};

FishingScene.prototype.render = function(ctx, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('每日奇遇 · 钓鱼', width / 2, 50);

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('今日剩余次数: ' + this.freeCount, width / 2, 75);

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
    var barWidth = width - 80;
    var barHeight = 20;
    var barX = 40;
    var barY = height / 2 - 10;
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
};

FishingScene.prototype.drawWater = function(ctx, width, height) {
  var waterY = 150;
  var waterHeight = height - 200;
  var gradient = ctx.createLinearGradient(0, waterY, 0, height - 50);
  gradient.addColorStop(0, 'rgba(50, 100, 150, 0.3)');
  gradient.addColorStop(1, 'rgba(20, 50, 100, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(20, waterY, width - 40, waterHeight);

  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  for (var i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(40, waterY + 50 + i * 40);
    for (var x = 40; x < width - 40; x += 20) {
      var y = waterY + 50 + i * 40 + Math.sin((x + this.castingProgress) * 5);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};

FishingScene.prototype.drawResult = function(ctx, width, height) {
  var centerY = height / 2 - 20;

  if (this.result.type === 'bait') {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('获得饵料', width / 2, centerY - 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px sans-serif';
    ctx.fillText('+' + this.result.amount + ' 🥢', width / 2, centerY + 20);
  } else {
    var creature = this.result.creature;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('钓到了', width / 2, centerY - 50);

    var rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);
    ctx.fillStyle = rarityColor;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(creature.name, width / 2, centerY + 5);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px sans-serif';
    ctx.fillText(creature.rarity + ' Lv.' + creature.level, width / 2, centerY + 35);
  }

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '14px sans-serif';
  ctx.fillText('点击继续', width / 2, height - 100);
};

FishingScene.prototype.handleTap = function() {
  if (this.state === 'idle') {
    return this.cast();
  } else if (this.state === 'result') {
    this.state = 'idle';
    this.result = null;
    return true;
  }
  return false;
};

// ========== 6. 海底小院 ==========
function GardenScene() {
  this.placedCreatures = [];
  this.width = 0;
  this.height = 0;
}

GardenScene.prototype.addCreature = function(creature) {
  var x = 50 + Math.random() * (this.width - 100);
  var y = 150 + Math.random() * (this.height - 250);
  this.placedCreatures.push({
    creature: creature,
    x: x,
    y: y,
    size: 80 + Math.random() * 40,
    floatOffset: Math.random() * Math.PI * 2
  });
  return true;
};

GardenScene.prototype.removeCreature = function(index) {
  if (index >= 0 && index < this.placedCreatures.length) {
    this.placedCreatures.splice(index, 1);
    return true;
  }
  return false;
};

GardenScene.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
};

GardenScene.prototype.update = function() {
  var that = this;
  this.placedCreatures.forEach(function(item) {
    item.floatOffset += 0.02;
    item.y += Math.sin(item.floatOffset) * 0.2;
  });
};

GardenScene.prototype.render = function(ctx, width, height) {
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

  var sandY = height - 120;
  var gradient = ctx.createLinearGradient(0, sandY, 0, height);
  gradient.addColorStop(0, '#c2b280');
  gradient.addColorStop(1, '#a08a50');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, sandY, width, 120);
  ctx.fillStyle = '#8a7a40';
  for (var i = 0; i < width; i += 10) {
    ctx.fillRect(i + Math.random() * 5, sandY + 80 + Math.random() * 30, 3, 30);
  }

  var that = this;
  this.placedCreatures.forEach(function(item) {
    var creature = item.creature;
    var rarityColor = CREATURE_DATA.getRarityColor(creature.rarity);

    var gradient = ctx.createRadialGradient(item.x, item.y, 0, item.x, item.y, item.size / 2);
    gradient.addColorStop(0, creature.color);
    gradient.addColorStop(1, rarityColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold ' + Math.floor(item.size / 4) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(creature.name, item.x, item.y + 5);
  });
};

GardenScene.prototype.handleTap = function(x, y) {
  for (var i = this.placedCreatures.length - 1; i >= 0; i--) {
    var item = this.placedCreatures[i];
    var dx = x - item.x;
    var dy = y - item.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < item.size / 2) {
      var that = this;
      wx.showModal({
        title: '移除生物',
        content: '是否将 ' + item.creature.name + ' 从小院移除？',
        success: function(res) {
          if (res.confirm) {
            that.removeCreature(i);
          }
        }
      });
      return true;
    }
  }
  return false;
};

// ========== 主游戏状态 ==========
var game = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,

  board: null,
  renderer: null,
  handbook: null,
  fishing: null,
  garden: null,

  currentScene: 'merge',
  bait: 100,
  unlockedCreatures: [1],
  mergedCount: 0,

  dragStart: null,
  isDragging: false,
  dragEnd: null,

  animationId: null
};

// ========== 初始化 ==========
function initGame() {
  var systemInfo = wx.getSystemInfoSync();
  game.width = systemInfo.windowWidth;
  game.height = systemInfo.windowHeight;

  game.canvas = wx.createCanvas();
  game.ctx = game.canvas.getContext('2d');
  game.canvas.width = game.width;
  game.height = game.height;

  game.board = new MergeBoard(5);
  game.renderer = new Renderer(game.canvas, game.ctx, game.board);
  game.handbook = new HandbookScene();
  game.fishing = new FishingScene();
  game.garden = new GardenScene();

  game.renderer.resize(game.width, game.height);
  game.garden.resize(game.width, game.height);

  game.board.spawnRandom(1);
  game.board.spawnRandom(1);

  bindEvents();

  gameLoop();

  console.log('海错图小游戏初始化完成');
}

// ========== 事件绑定 ==========
function bindEvents() {
  // 微信小游戏触摸事件绑定在wx对象上
  wx.onTouchStart(handleTouchStart);
  wx.onTouchMove(handleTouchMove);
  wx.onTouchEnd(handleTouchEnd);
}

function handleTouchStart(e) {
  var x = e.touches[0].clientX;
  var y = e.touches[0].clientY;

  var navItem = game.renderer.getNavItem(x, y);
  if (navItem) {
    game.currentScene = navItem;
    render();
    return;
  }

  if (game.currentScene === 'merge') {
    var pos = game.renderer.getGridPosition(x, y);
    if (pos && game.board.grid[pos.r][pos.c]) {
      game.dragStart = pos;
      game.isDragging = true;
    }
  } else if (game.currentScene === 'fishing') {
    game.fishing.handleTap();
  } else if (game.currentScene === 'garden') {
    game.garden.handleTap(x, y);
  }

  render();
}

function handleTouchMove(e) {
  if (!game.isDragging || game.currentScene !== 'merge') {
    if (game.currentScene === 'handbook') {
      var deltaY = e.changedTouches[0].clientY - e.touches[0].clientY;
      game.handbook.handleTouchMove(deltaY);
      render();
    }
    return;
  }

  var x = e.touches[0].clientX;
  var y = e.touches[0].clientY;
  var endPos = game.renderer.getGridPosition(x, y);
  game.dragEnd = endPos;
  render();
}

function handleTouchEnd(e) {
  if (!game.isDragging || game.currentScene !== 'merge') {
    game.isDragging = false;
    game.dragStart = null;
    game.dragEnd = null;
    return;
  }

  var x = e.changedTouches[0].clientX;
  var y = e.changedTouches[0].clientY;
  var endPos = game.renderer.getGridPosition(x, y);

  if (endPos && game.dragStart && endPos.r === game.dragStart.r && endPos.c === game.dragStart.c) {
  } else if (endPos && !game.board.grid[endPos.r][endPos.c]) {
    game.board.move(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
    spawnNew();
  } else if (endPos && game.board.grid[endPos.r][endPos.c]) {
    if (game.board.grid[game.dragStart.r][game.dragStart.c].level ===
      game.board.grid[endPos.r][endPos.c].level) {
      var newCreature = game.board.merge(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
      if (newCreature) {
        unlockCreature(newCreature.level);
        game.bait += Math.floor(newCreature.level * 2);
        game.mergedCount++;

        if (newCreature.level >= 20) {
          game.garden.addCreature(newCreature);
        }

        wx.vibrateShort({ type: 'light' });
        spawnNew();

        wx.showToast({
          title: '合成成功！' + newCreature.name,
          icon: 'none'
        });
      }
    } else {
      game.board.move(game.dragStart.r, game.dragStart.c, endPos.r, endPos.c);
    }
  }

  if (game.board.isGameOver()) {
    wx.showModal({
      title: '棋盘已满',
      content: '没有可合并的生物了，是否清空重开？',
      success: function(res) {
        if (res.confirm) {
          game.board.clear();
          game.board.spawnRandom(1);
          game.board.spawnRandom(1);
        }
      }
    });
  }

  game.isDragging = false;
  game.dragStart = null;
  game.dragEnd = null;

  render();
}

function spawnNew() {
  if (game.bait <= 0) {
    wx.showToast({
      title: '饵料不足啦，去钓鱼或分享获得吧',
      icon: 'none'
    });
    return false;
  }

  var emptyCount = game.board.getEmptyCount();
  if (emptyCount === 0) return false;

  game.bait--;
  var level = Math.random() > 0.9 ? 2 : 1;
  game.board.spawnRandom(level);
  return true;
}

function unlockCreature(level) {
  if (game.unlockedCreatures.indexOf(level) < 0) {
    game.unlockedCreatures.push(level);
    var creature = CREATURE_DATA.getCreatureByLevel(level);
    wx.showToast({
      title: '解锁新生物：' + creature.name,
      icon: 'none',
      duration: 2000
    });
    game.bait += level;
  }
}

function autoCollapse() {
  if (game.currentScene !== 'merge') return;
  var changed = game.board.collapseDown();
  if (changed) {
    render();
  } else {
    wx.showToast({
      title: '已经是最整齐的啦',
      icon: 'none'
    });
  }
}

function gameLoop() {
  if (game.currentScene === 'fishing') {
    game.fishing.update();
  }

  if (game.currentScene === 'garden') {
    game.garden.update();
  }

  render();
  game.animationId = requestAnimationFrame(gameLoop);
}

function render() {
  game.renderer.render(game);
}

// 屏幕旋转处理
wx.onDeviceOrientationChange(function() {
  var systemInfo = wx.getSystemInfoSync();
  game.width = systemInfo.windowWidth;
  game.height = systemInfo.windowHeight;
  game.canvas.width = game.width;
  game.canvas.height = game.height;
  game.renderer.resize(game.width, game.height);
  game.garden.resize(game.width, game.height);
  render();
});

// 启动游戏
initGame();