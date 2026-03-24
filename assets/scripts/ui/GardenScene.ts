import { _decorator, Component, Node, Label, Button, Sprite, Prefab, instantiate, Vec3, NodeSpace } from 'cc';
import { ApiManager } from '../net/ApiManager';
const { ccclass, property } = _decorator;

/**
 * 庭院放置的神兽信息
 */
export interface PlacedCreature {
  creatureId: number;
  x: number;
  y: number;
}

/**
 * 海底小院场景
 * 玩家可以将合成获得的神兽放置在小院中展示饲养
 */
@ccclass('GardenScene')
export class GardenScene extends Component {
  /** 小院容器节点 */
  @property(Node)
  gardenContainer: Node | null = null;

  /** 神兽预制体 */
  @property(Prefab)
  creaturePrefab: Prefab | null = null;

  /** 解锁槽位按钮 */
  @property(Button)
  unlockSlotButton: Button | null = null;

  /** 返回按钮 */
  @property(Button)
  backButton: Button | null = null;

  /** 已放置神兽列表 */
  @property(Label)
  placedCountLabel: Label | null = null;

  /** 当前用户ID */
  private userId: string = '';

  /** 已放置的神兽 */
  private placedCreatures: PlacedCreature[] = [];

  /** 解锁的槽位数 */
  private unlockedSlots: number = 1;

  /** 每个槽位解锁价格 */
  private readonly unlockCosts: number[] = [0, 100, 300, 500, 1000];

  onLoad() {
    // 绑定按钮事件
    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this.onBackClick, this);
    }
    if (this.unlockSlotButton) {
      this.unlockSlotButton.node.on(Button.EventType.CLICK, this.onUnlockSlotClick, this);
    }
  }

  start() {
    this.userId = wx.getStorageSync('current_user_id') || '';
    this.loadGardenData();
  }

  /**
   * 从后端加载庭院数据
   */
  private async loadGardenData() {
    if (!this.userId) {
      console.error('用户未登录');
      return;
    }

    try {
      const res = await ApiManager.instance.getYardInfo(this.userId);
      if (res.success && res.data) {
        this.placedCreatures = res.data;
        this.renderGarden();
        this.updatePlacedCount();
      }
    } catch (e) {
      console.error('加载庭院数据失败:', e);
    }
  }

  /**
   * 渲染庭院
   */
  private renderGarden() {
    if (!this.gardenContainer || !this.creaturePrefab) {
      return;
    }

    // 清除已有节点
    this.gardenContainer.removeAllChildren();

    // 创建网格布局，假设5x5
    const gridSize = 5;
    const cellSize = 100; // 每个格子大小

    this.placedCreatures.forEach(placed => {
      const creatureNode = instantiate(this.creaturePrefab!);

      // 计算位置，网格布局
      const x = placed.x * cellSize - (gridSize * cellSize) / 2 + cellSize / 2;
      const y = placed.y * cellSize - (gridSize * cellSize) / 2 + cellSize / 2;
      creatureNode.setPosition(new Vec3(x, y, 0));

      // TODO: 根据creatureId设置图片
      creatureNode.name = `creature_${placed.creatureId}`;

      // 绑定点击事件，点击可以更换位置
      creatureNode.on(Node.EventType.TOUCH_END, () => {
        this.onCreatureClick(placed);
      }, this);

      this.gardenContainer!.addChild(creatureNode);
    });

    this.updateUnlockButton();
  }

  /**
   * 更新已放置计数
   */
  private updatePlacedCount() {
    if (this.placedCountLabel) {
      this.placedCountLabel.string = `已放置: ${this.placedCreatures.length} / ${this.unlockedSlots}`;
    }
  }

  /**
   * 更新解锁按钮状态
   */
  private updateUnlockButton() {
    if (this.unlockSlotButton) {
      const nextCost = this.unlockCosts[this.unlockedSlots] || 0;
      if (nextCost <= 0) {
        this.unlockSlotButton.node.active = false;
      } else {
        this.unlockSlotButton.node.active = true;
        const label = this.unlockSlotButton.node.getChildByName('Label')?.getComponent(Label);
        if (label) {
          label.string = `解锁槽位 (${nextCost} 饵料)`;
        }
      }
    }
  }

  /**
   * 点击神兽
   */
  private onCreatureClick(placed: PlacedCreature) {
    // TODO: 弹出操作菜单，可以移动或移除
    console.log('点击神兽:', placed);
  }

  /**
   * 点击解锁新槽位
   */
  private async onUnlockSlotClick() {
    if (!this.userId) {
      return;
    }

    const nextSlotIndex = this.unlockedSlots;
    const cost = this.unlockCosts[nextSlotIndex];

    if (!cost) {
      console.log('所有槽位已解锁');
      return;
    }

    try {
      const res = await ApiManager.instance.unlockYardSlot(this.userId, nextSlotIndex + 1, cost);
      if (res.success && res.data) {
        this.unlockedSlots++;
        this.updatePlacedCount();
        this.updateUnlockButton();
        console.log('成功解锁新槽位');
      } else {
        console.error('解锁失败:', res.message);
      }
    } catch (e) {
      console.error('解锁槽位异常:', e);
    }
  }

  /**
   * 放置神兽到庭院
   */
  public async placeCreature(creatureId: number, x: number, y: number): Promise<boolean> {
    if (!this.userId) {
      return false;
    }

    try {
      const res = await ApiManager.instance.placeYardCreature(this.userId, creatureId, {x, y});
      if (res.success && res.data) {
        this.placedCreatures.push({creatureId, x, y});
        this.renderGarden();
        this.updatePlacedCount();
        return true;
      }
      return false;
    } catch (e) {
      console.error('放置神兽失败:', e);
      return false;
    }
  }

  /**
   * 返回主场景
   */
  private onBackClick() {
    // TODO: director.loadScene('MainScene');
    console.log('返回主场景');
  }
}
