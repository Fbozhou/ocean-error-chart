import { _decorator, Component, Node, Vec2, EventTouch, Input } from 'cc';
import { MergeBoard } from './MergeBoard';
const { ccclass, property } = _decorator;

/**
 * 单个生物单元格
 * 处理拖拽交互
 */
@ccclass('CreatureCell')
export class CreatureCell extends Component {
  /** 单元格坐标 */
  private x: number = 0;
  private y: number = 0;

  /** 所属棋盘 */
  private board: MergeBoard | null = null;

  /** 拖拽起始位置 */
  private startPos: Vec2 | null = null;

  /** 是否正在拖拽 */
  private isDragging: boolean = false;

  init(x: number, y: number, board: MergeBoard) {
    this.x = x;
    this.y = y;
    this.board = board;

    // 监听触摸事件
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getCoordinates(): {x: number, y: number} {
    return {x: this.x, y: this.y};
  }

  private onTouchStart(event: EventTouch) {
    this.startPos = event.getLocation();
    this.isDragging = false;
  }

  private onTouchMove(event: EventTouch) {
    if (!this.startPos) return;
    
    const currentPos = event.getLocation();
    const delta = currentPos.subtract(this.startPos);
    
    // 判断是否超过拖拽阈值，才开始拖拽
    if (!this.isDragging && delta.length() > 10) {
      this.isDragging = true;
    }

    // 跟随拖拽
    if (this.isDragging && this.node) {
      const worldPos = event.getUILocation();
      this.node.getParent()?.convertToNodeSpaceAR(worldPos, this.node.position);
    }
  }

  private onTouchEnd(event: EventTouch) {
    if (!this.isDragging || !this.board) {
      this.isDragging = false;
      this.startPos = null;
      // 弹回原位置
      if (this.node && this.board) {
        this.node.setPosition(this.board.getPositionAt(this.x, this.y));
      }
      return;
    }

    // 计算落点在哪个格子
    const endPos = event.getLocation();
    const uiPos = event.getUILocation();
    const nodePos = this.node.getParent()?.convertToNodeSpaceAR(uiPos);
    if (!nodePos || !this.board) {
      this.resetPosition();
      return;
    }

    // 转换为棋盘坐标
    const cellSize = this.board['cellSize'] + this.board['cellSpacing'];
    const startX = -((this.board['boardSize'] * cellSize) / 2) + (cellSize / 2);
    const startY = ((this.board['boardSize'] * cellSize) / 2) - (cellSize / 2);

    let targetX = Math.round((nodePos.x - startX) / cellSize);
    let targetY = Math.round((startY - nodePos.y) / cellSize);

    // 边界限制
    targetX = Math.max(0, Math.min(this.board['boardSize'] - 1, targetX));
    targetY = Math.max(0, Math.min(this.board['boardSize'] - 1, targetY));

    // 尝试交换/合成
    const merged = this.board.trySwap(this.x, this.y, targetX, targetY);
    
    if (!merged) {
      // 没有合成，重置位置（如果交换了，已经处理了位置）
      if (this.x === targetX && this.y === targetY) {
        this.resetPosition();
      }
    }

    this.isDragging = false;
    this.startPos = null;
  }

  private resetPosition() {
    if (this.board && this.node) {
      this.node.setPosition(this.board.getPositionAt(this.x, this.y));
    }
  }
}
