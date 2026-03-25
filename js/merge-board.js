// 《海错图》合成棋盘核心逻辑
class MergeBoard {
  constructor(size = 5) {
    this.size = size;          // 棋盘大小 N x N
    this.grid = [];            // 棋盘格子数据 [row][col] = creature or null
    this.init();
  }

  // 初始化空棋盘
  init() {
    this.grid = [];
    for (let r = 0; r < this.size; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = null;
      }
    }
  }

  // 获取空位数
  getEmptyCount() {
    let count = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) count++;
      }
    }
    return count;
  }

  // 获取所有空位坐标
  getEmptyPositions() {
    const positions = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) {
          positions.push({ r, c });
        }
      }
    }
    return positions;
  }

  // 随机放置新生物
  spawnRandom(level = 1) {
    const empties = this.getEmptyPositions();
    if (empties.length === 0) return null;

    const randomIdx = Math.floor(Math.random() * empties.length);
    const { r, c } = empties[randomIdx];
    const creature = CREATURE_DATA.getCreatureByLevel(level);
    this.grid[r][c] = { ...creature, x: c, y: r };
    return { r, c, creature };
  }

  // 检测游戏是否结束
  isGameOver() {
    // 如果还有空位，没结束
    if (this.getEmptyCount() > 0) return false;

    // 检查有没有相邻相同可以合并
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const current = this.grid[r][c];
        if (!current) continue;

        // 检查右边和下边是否有相同
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
  }

  // 自动整理：将所有生物向底部压缩对齐
  collapseDown() {
    let changed = false;

    for (let c = 0; c < this.size; c++) {
      let writePos = this.size - 1;
      for (let r = this.size - 1; r >= 0; r--) {
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
  }

  // 移动生物
  move(fromR, fromC, toR, toC) {
    if (!this.isValidPosition(toR, toC) || this.grid[toR][toC]) {
      return false;
    }

    this.grid[toR][toC] = this.grid[fromR][fromC];
    this.grid[toR][toC].y = toR;
    this.grid[toR][toC].x = toC;
    this.grid[fromR][fromC] = null;
    return true;
  }

  // 检查坐标是否有效
  isValidPosition(r, c) {
    return r >= 0 && r < this.size && c >= 0 && c < this.size;
  }

  // 合并两个生物
  merge(fromR, fromC, toR, toC) {
    const a = this.grid[fromR][fromC];
    const b = this.grid[toR][toC];

    if (!a || !b) return null;
    if (!CREATURE_DATA.canMerge(a, b)) return null;

    const newCreature = CREATURE_DATA.mergeResult(a);
    this.grid[toR][toC] = { ...newCreature, x: toC, y: toR };
    this.grid[fromR][fromC] = null;

    return newCreature;
  }

  // 清理棋盘（重新开始）
  clear() {
    this.init();
  }

  // 获取所有生物
  getAllCreatures() {
    const creatures = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c]) {
          creatures.push({ ...this.grid[r][c], r, c });
        }
      }
    }
    return creatures;
  }
}

// 导出
window.MergeBoard = MergeBoard;
