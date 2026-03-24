import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform } from 'cc';
import { MarineCreature } from '../core/MarineData';
import { CreatureCell } from './CreatureCell';
const { ccclass, property } = _decorator;

/**
 * 合成棋盘单元格
 */
export interface BoardCell {
  x: number;
  y: number;
  creatureId: number | null;
  node: Node | null;
}

/**
 * 合成棋盘管理器
 * 5x5网格，处理拖拽合成逻辑
 */
@ccclass('MergeBoard')
export class MergeBoard extends Component {
  /** 棋盘大小，默认5x5 */
  @property
  boardSize: number = 5;

  /** 单元格预制体 */
  @property(Prefab)
  cellPrefab: Prefab | null = null;

  /** 生物预制体父节点 */
  @property(Node)
  contentNode: Node | null = null;

  /** 单元格间距 */
  @property
  cellSpacing: number = 10;

  /** 棋盘数据 */
  private board: BoardCell[][] = [];

  /** 单元格大小 */
  private cellSize: number = 0;

  /** 当前选中的单元格 */
  private selectedCell: BoardCell | null = null;

  /** 合成完成回调 */
  public onMergeComplete: ((newCreatureId: number, x: number, y: number) => void) | null = null;

  onLoad() {
    this.initBoard();
  }

  /**
   * 初始化棋盘
   */
  private initBoard() {
    this.cellSize = this.cellPrefab?.data?.getComponent(UITransform)?.contentSize.width || 100;
    const totalSize = this.boardSize * (this.cellSize + this.cellSpacing) - this.cellSpacing;
    
    // 调整contentNode大小
    if (this.contentNode) {
      const uiTrans = this.contentNode.getComponent(UITransform);
      if (uiTrans) {
        uiTrans.setContentSize(totalSize, totalSize);
      }
    }

    // 初始化数据
    for (let y = 0; y < this.boardSize; y++) {
      this.board[y] = [];
      for (let x = 0; x < this.boardSize; x++) {
        this.board[y][x] = {
          x,
          y,
          creatureId: null,
          node: null,
        };
      }
    }
  }

  /**
   * 获取世界坐标位置
   */
  public getPositionAt(x: number, y: number): Vec3 {
    const startX = -((this.boardSize * (this.cellSize + this.cellSpacing)) / 2) + (this.cellSize / 2);
    const startY = ((this.boardSize * (this.cellSize + this.cellSpacing)) / 2) - (this.cellSize / 2);
    
    return new Vec3(
      startX + x * (this.cellSize + this.cellSpacing),
      startY - y * (this.cellSize + this.cellSpacing),
      0
    );
  }

  /**
   * 在指定位置放置生物
   */
  public placeCreature(x: number, y: number, creatureId: number, prefab: Prefab): boolean {
    if (this.board[y][x].creatureId !== null) {
      return false;
    }

    const cell = this.board[y][x];
    cell.creatureId = creatureId;
    
    // 创建节点
    if (this.contentNode && prefab) {
      const node = instantiate(prefab);
      node.setPosition(this.getPositionAt(x, y));
      node.setParent(this.contentNode);
      cell.node = node;

      // 添加单元格组件
      const cellComp = node.addComponent(CreatureCell);
      cellComp.init(x, y, this);
    }

    return true;
  }

  /**
   * 移除指定位置生物
   */
  public removeCreature(x: number, y: number) {
    const cell = this.board[y][x];
    if (cell.node) {
      cell.node.destroy();
    }
    cell.creatureId = null;
    cell.node = null;
  }

  /**
   * 尝试交换两个单元格
   */
  public trySwap(fromX: number, fromY: number, toX: number, toY: number): boolean {
    const fromCell = this.board[fromY][fromX];
    const toCell = this.board[toY][toX];

    // 如果目标为空，只是移动
    if (toCell.creatureId === null) {
      toCell.creatureId = fromCell.creatureId;
      toCell.node = fromCell.node;
      if (toCell.node) {
        toCell.node.setPosition(this.getPositionAt(toX, toY));
        const comp = toCell.node.getComponent(CreatureCell);
        comp?.updatePosition(toX, toY);
      }
      fromCell.creatureId = null;
      fromCell.node = null;
      return false; // 没有合成
    }

    // 如果两个相同，合成
    if (fromCell.creatureId === toCell.creatureId) {
      // 这里需要从配置获取下一级
      const nextId = MarineConfig.instance.getNextLevelCreatureId(fromCell.creatureId!);
      if (nextId) {
        // 移除两个
        this.removeCreature(fromX, fromY);
        this.removeCreature(toX, toY);
        // 触发合成完成回调，由外部处理创建新生物
        if (this.onMergeComplete) {
          this.onMergeComplete(nextId, toX, toY);
        }
        return true;
      }
    }

    // 不同级，交换位置
    const tempId = fromCell.creatureId;
    const tempNode = fromCell.node;
    fromCell.creatureId = toCell.creatureId;
    fromCell.node = toCell.node;
    toCell.creatureId = tempId;
    toCell.node = tempNode;

    // 更新位置
    if (fromCell.node) {
      fromCell.node.setPosition(this.getPositionAt(fromX, fromY));
      const comp = fromCell.node.getComponent(CreatureCell);
      comp?.updatePosition(fromX, fromY);
    }
    if (toCell.node) {
      toCell.node.setPosition(this.getPositionAt(toX, toY));
      const comp = toCell.node.getComponent(CreatureCell);
      comp?.updatePosition(toX, toY);
    }

    return false;
  }

  /**
   * 查找空位置
   */
  public findEmptyCell(): {x: number, y: number} | null {
    const emptyCells: {x: number, y: number}[] = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (this.board[y][x].creatureId === null) {
          emptyCells.push({x, y});
        }
      }
    }
    if (emptyCells.length === 0) {
      return null;
    }
    // 随机返回一个空位置
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  /**
   * 自动整理棋盘（把所有生物挤到一边）
   * 经典合成游戏整理逻辑
   */
  public autoOrganize() {
    // 提取所有非空生物，按顺序重新排列
    const creatures: number[] = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (this.board[y][x].creatureId !== null) {
          creatures.push(this.board[y][x].creatureId!);
        }
      }
    }

    // 清空棋盘
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        this.removeCreature(x, y);
      }
    }

    // 重新从左上角开始排列
    let index = 0;
    for (let y = 0; y < this.boardSize && index < creatures.length; y++) {
      for (let x = 0; x < this.boardSize && index < creatures.length; x++) {
        this.board[y][x].creatureId = creatures[index++];
        // 节点会在刷新时重建，这里只存数据
      }
    }
  }

  /**
   * 检查棋盘是否还有可合成
   */
  public hasPossibleMerge(): boolean {
    // 检查相邻格子是否有相同
    const dirs = [[0, 1], [1, 0]]; // 只需要检查右下，避免重复
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        const current = this.board[y][x].creatureId;
        if (current === null) continue;

        for (const [dx, dy] of dirs) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < this.boardSize && ny < this.boardSize) {
            const neighbor = this.board[ny][nx].creatureId;
            if (neighbor === current) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /** 获取棋盘数据 */
  public getBoard(): BoardCell[][] {
    return this.board;
  }
}
