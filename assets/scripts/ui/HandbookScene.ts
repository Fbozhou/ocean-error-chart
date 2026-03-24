import { _decorator, Component, Node, Label, Button, Sprite, ScrollView, Prefab, instantiate, RichText } from 'cc';
import { ApiManager } from '../net/ApiManager';
import { MarineConfig } from '../core/MarineData';
const { ccclass, property } = _decorator;

/**
 * 生物图鉴信息
 */
export interface HandbookItem {
  id: number;
  level: number;
  name: string;
  description: string;
  fromText: string; // 《海错图》或《山海经》来源
  imageUrl: string;
  unlocked: boolean;
}

/**
 * 海错图图鉴场景
 * 展示已解锁的生物，附带科普文案
 */
@ccclass('HandbookScene')
export class HandbookScene extends Component {
  /** 图鉴列表滚动视图 */
  @property(ScrollView)
  handbookScroll: ScrollView | null = null;

  /** 图鉴项预制体 */
  @property(Prefab)
  handbookItemPrefab: Prefab | null = null;

  /** 详情面板 */
  @property(Node)
  detailPanel: Node | null = null;

  /** 详情名称 */
  @property(Label)
  detailNameLabel: Label | null = null;

  /** 详情来源 */
  @property(Label)
  detailSourceLabel: Label | null = null;

  /** 详情描述 */
  @property(RichText)
  detailDescLabel: RichText | null = null;

  /** 详情图片 */
  @property(Sprite)
  detailImageSprite: Sprite | null = null;

  /** 统计标签 */
  @property(Label)
  statsLabel: Label | null = null;

  /** 返回按钮 */
  @property(Button)
  backButton: Button | null = null;

  /** 图鉴数据 */
  private handbookData: HandbookItem[] = [];

  /** 当前用户ID */
  private userId: string = '';

  onLoad() {
    // 绑定返回按钮
    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this.onBackClick, this);
    }

    // 初始隐藏详情面板
    if (this.detailPanel) {
      this.detailPanel.active = false;
    }
  }

  start() {
    // 从本地存储获取userId
    this.userId = wx.getStorageSync('current_user_id') || '';
    this.loadHandbookData();
  }

  /**
   * 从后端加载图鉴数据
   */
  private async loadHandbookData() {
    if (!this.userId) {
      console.error('用户未登录，无法加载图鉴');
      return;
    }

    try {
      // 获取统计信息
      const statsRes = await ApiManager.instance.getIllustrationStats(this.userId);
      if (statsRes.success && statsRes.data) {
        this.updateStats(statsRes.data.total, statsRes.data.unlocked);
      }

      // 获取已解锁列表
      const listRes = await ApiManager.instance.getIllustrationList(this.userId);
      if (listRes.success && listRes.data) {
        this.buildHandbookData(listRes.data);
        this.renderHandbookList();
      }
    } catch (e) {
      console.error('加载图鉴失败:', e);
    }
  }

  /**
   * 构建图鉴数据
   */
  private buildHandbookData(unlockedIds: number[]) {
    // 从MarineConfig获取全量生物配置
    const allCreatures = MarineConfig.instance.getAllCreatures();
    this.handbookData = allCreatures.map(creature => {
      return {
        id: creature.id,
        level: creature.level,
        name: creature.name,
        description: creature.description,
        fromText: creature.source,
        imageUrl: creature.imageUrl,
        unlocked: unlockedIds.includes(creature.id)
      };
    });

    // 按等级排序
    this.handbookData.sort((a, b) => a.level - b.level);
  }

  /**
   * 更新统计显示
   */
  private updateStats(total: number, unlocked: number) {
    if (this.statsLabel) {
      this.statsLabel.string = `已收集: ${unlocked} / ${total}`;
    }
  }

  /**
   * 渲染图鉴列表
   */
  private renderHandbookList() {
    if (!this.handbookScroll || !this.handbookItemPrefab) {
      return;
    }

    const content = this.handbookScroll.content;
    content.removeAllChildren();

    this.handbookData.forEach(item => {
      const itemNode = instantiate(this.handbookItemPrefab!);
      this.setupHandbookItem(itemNode, item);
      content.addChild(itemNode);
    });
  }

  /**
   * 设置单个图鉴项
   */
  private setupHandbookItem(itemNode: Node, item: HandbookItem) {
    const nameLabel = itemNode.getChildByName('NameLabel')?.getComponent(Label);
    const levelLabel = itemNode.getChildByName('LevelLabel')?.getComponent(Label);
    const bgSprite = itemNode.getChildByName('Background')?.getComponent(Sprite);

    if (nameLabel) {
      nameLabel.string = item.name;
    }
    if (levelLabel) {
      levelLabel.string = `Lv.${item.level}`;
    }

    // 未解锁置灰
    if (!item.unlocked && bgSprite) {
      // 修改透明度表示未解锁
      bgSprite.color.set(255, 255, 255, 100);
    }

    // 点击打开详情
    itemNode.on(Node.EventType.TOUCH_END, () => {
      if (item.unlocked) {
        this.openDetail(item);
      }
    }, this);
  }

  /**
   * 打开生物详情
   */
  private openDetail(item: HandbookItem) {
    if (!this.detailPanel) return;

    this.detailPanel.active = true;

    if (this.detailNameLabel) {
      this.detailNameLabel.string = item.name;
    }
    if (this.detailSourceLabel) {
      this.detailSourceLabel.string = item.fromText;
    }
    if (this.detailDescLabel) {
      this.detailDescLabel.string = item.description;
    }

    // TODO: 加载生物图片到detailImageSprite
    console.log('打开详情:', item);
  }

  /**
   * 关闭详情
   */
  onCloseDetail() {
    if (this.detailPanel) {
      this.detailPanel.active = false;
    }
  }

  /**
   * 返回主场景
   */
  onBackClick() {
    // TODO: director.loadScene('MainScene');
    console.log('返回主场景');
  }
}
