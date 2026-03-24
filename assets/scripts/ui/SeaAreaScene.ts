import { _decorator, Component, Node, Label, Button, Sprite, _decorator, Prefab, instantiate, ScrollView } from 'cc';
import { ApiManager } from '../net/ApiManager';
const { ccclass, property } = _decorator;

/**
 * 海域信息
 */
export interface SeaAreaInfo {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  requireLevel: number;
  costBait: number;
  icon: string;
}

/**
 * 海域选择/解锁场景
 */
@ccclass('SeaAreaScene')
export class SeaAreaScene extends Component {
  /** 滚动视图容器 */
  @property(ScrollView)
  scrollView: ScrollView | null = null;

  /** 海域项预制体 */
  @property(Prefab)
  seaAreaItemPrefab: Prefab | null = null;

  /** 当前海域名称 */
  @property(Label)
  currentSeaAreaLabel: Label | null = null;

  /** 返回主场景按钮 */
  @property(Button)
  backButton: Button | null = null;

  /** 海域数据 */
  private seaAreas: SeaAreaInfo[] = [];

  /** 当前选中海域ID */
  private currentSeaAreaId: number = 1;

  onLoad() {
    // 绑定按钮事件
    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this.onBackClick, this);
    }
  }

  start() {
    this.loadSeaAreas();
  }

  /**
   * 从后端加载海域信息
   */
  private async loadSeaAreas() {
    // TODO: 后端接口获取用户已解锁海域
    // 先初始化默认数据
    this.seaAreas = [
      {
        id: 1,
        name: '近海浅滩',
        description: '从这里开始你的海洋收集之旅',
        unlocked: true,
        requireLevel: 1,
        costBait: 0,
        icon: 'sea1'
      },
      {
        id: 2,
        name: '远海深渊',
        description: '更深的海域，更稀有的生物',
        unlocked: false,
        requireLevel: 10,
        costBait: 100,
        icon: 'sea2'
      },
      {
        id: 3,
        name: '龙宫秘境',
        description: '传说中的龙宫，神兽栖息之地',
        unlocked: false,
        requireLevel: 20,
        costBait: 500,
        icon: 'sea3'
      }
    ];

    this.renderSeaAreaList();
    this.updateCurrentSeaAreaDisplay();
  }

  /**
   * 渲染海域列表
   */
  private renderSeaAreaList() {
    if (!this.scrollView || !this.seaAreaItemPrefab) {
      return;
    }

    const content = this.scrollView.content;
    content.removeAllChildren();

    this.seaAreas.forEach(area => {
      const item = instantiate(this.seaAreaItemPrefab!);
      this.setupSeaAreaItem(item, area);
      content.addChild(item);
    });
  }

  /**
   * 设置单个海域项
   */
  private setupSeaAreaItem(item: Node, area: SeaAreaInfo) {
    // 获取item上的组件
    const nameLabel = item.getChildByName('NameLabel')?.getComponent(Label);
    const descLabel = item.getChildByName('DescLabel')?.getComponent(Label);
    const unlockButton = item.getChildByName('UnlockButton')?.getComponent(Button);

    if (nameLabel) {
      nameLabel.string = area.name;
    }
    if (descLabel) {
      descLabel.string = area.description;
    }

    // 如果已解锁，隐藏解锁按钮
    if (area.unlocked && unlockButton) {
      unlockButton.node.active = false;
    }

    // 绑定解锁按钮事件
    if (unlockButton && !area.unlocked) {
      unlockButton.node.on(Button.EventType.CLICK, () => {
        this.onUnlockClick(area);
      }, this);
    }

    // 已解锁可以点击选中
    if (area.unlocked) {
      item.on(Node.EventType.TOUCH_END, () => {
        this.selectSeaArea(area.id);
      }, this);
    }
  }

  /**
   * 选择海域
   */
  private selectSeaArea(id: number) {
    this.currentSeaAreaId = id;
    this.updateCurrentSeaAreaDisplay();
    // TODO: 保存当前选中海域，切换主场景加载对应海域
  }

  /**
   * 点击解锁海域
   */
  private async onUnlockClick(area: SeaAreaInfo) {
    const token = ApiManager.instance.getToken();
    if (!token) {
      console.error('未登录，无法解锁海域');
      return;
    }

    // 获取当前用户ID，实际应该从存储获取
    const userId = ''; // TODO: 从本地存储获取userId

    try {
      const res = await ApiManager.instance.unlockSeaArea(userId, area.id);
      if (res.success && res.data) {
        area.unlocked = true;
        this.renderSeaAreaList();
        console.log(`成功解锁海域: ${area.name}`);
      } else {
        console.error(`解锁失败: ${res.message}`);
      }
    } catch (e) {
      console.error('解锁海域异常:', e);
    }
  }

  /**
   * 更新当前海域显示
   */
  private updateCurrentSeaAreaDisplay() {
    const area = this.seaAreas.find(a => a.id === this.currentSeaAreaId);
    if (area && this.currentSeaAreaLabel) {
      this.currentSeaAreaLabel.string = `当前海域: ${area.name}`;
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
