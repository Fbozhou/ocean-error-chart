import { _decorator, Component, Node, Label, Button, Sprite, animation, AnimationClip } from 'cc';
import { ApiManager } from '../net/ApiManager';
const { ccclass, property } = _decorator;

/**
 * 钓鱼奖励类型
 */
type RewardType = 'bait' | 'creature' | 'fragment';

/**
 * 每日钓鱼奇遇场景
 * 玩家每天可以免费钓鱼，获得随机奖励
 */
@ccclass('FishingScene')
export class FishingScene extends Component {
  /** 剩余次数标签 */
  @property(Label)
  remainingLabel: Label | null = null;

  /** 钓鱼按钮 */
  @property(Button)
  fishingButton: Button | null = null;

  /** 增加次数按钮（看广告） */
  @property(Button)
  addCountButton: Button | null = null;

  /** 奖励展示节点 */
  @property(Node)
  rewardPanel: Node | null = null;

  /** 奖励图标 */
  @property(Sprite)
  rewardIcon: Sprite | null = null;

  /** 奖励名称标签 */
  @property(Label)
  rewardNameLabel: Label | null = null;

  /** 钓鱼动画 */
  @property(animation.Animation)
  fishingAnimation: animation.Animation | null = null;

  /** 返回按钮 */
  @property(Button)
  backButton: Button | null = null;

  /** 当前用户ID */
  private userId: string = '';

  /** 剩余钓鱼次数 */
  private remainingCount: number = 0;

  /** 是否正在钓鱼中 */
  private isFishing: boolean = false;

  /** 奖励名称映射 */
  private rewardTypeNames: Record<RewardType, string> = {
    'bait': '饵料',
    'creature': '海洋生物',
    'fragment': '碎片'
  };

  onLoad() {
    // 绑定按钮事件
    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this.onBackClick, this);
    }
    if (this.fishingButton) {
      this.fishingButton.node.on(Button.EventType.CLICK, this.onFishingClick, this);
    }
    if (this.addCountButton) {
      this.addCountButton.node.on(Button.EventType.CLICK, this.onAddCountClick, this);
    }

    // 初始隐藏奖励面板
    if (this.rewardPanel) {
      this.rewardPanel.active = false;
    }
  }

  start() {
    this.userId = wx.getStorageSync('current_user_id') || '';
    this.loadRemainingCount();
  }

  /**
   * 加载剩余次数
   */
  private async loadRemainingCount() {
    if (!this.userId) {
      console.error('用户未登录');
      return;
    }

    try {
      const res = await ApiManager.instance.getFishingRemaining(this.userId);
      if (res.success && res.data) {
        this.remainingCount = res.data.count;
        this.updateRemainingLabel();
        this.updateButtonState();
      }
    } catch (e) {
      console.error('加载钓鱼次数失败:', e);
    }
  }

  /**
   * 更新剩余次数显示
   */
  private updateRemainingLabel() {
    if (this.remainingLabel) {
      this.remainingLabel.string = `今日剩余: ${this.remainingCount} 次`;
    }
  }

  /**
   * 更新按钮状态
   */
  private updateButtonState() {
    if (this.fishingButton) {
      this.fishingButton.interactable = this.remainingCount > 0;
    }
  }

  /**
   * 点击钓鱼
   */
  private async onFishingClick() {
    if (this.isFishing || this.remainingCount <= 0 || !this.userId) {
      return;
    }

    this.isFishing = true;
    this.fishingButton!.interactable = false;

    // 播放钓鱼动画
    if (this.fishingAnimation) {
      this.fishingAnimation.play('fishing-cast');
    }

    // 等待动画播放完成
    await this.delay(2000);

    try {
      const res = await ApiManager.instance.doFishing(this.userId);
      if (res.success && res.data) {
        this.showReward(res.data.rewardType, res.data.rewardId, res.data.amount);
        this.remainingCount--;
        this.updateRemainingLabel();
        this.updateButtonState();
      } else {
        console.error('钓鱼失败:', res.message);
      }
    } catch (e) {
      console.error('钓鱼异常:', e);
    }

    this.isFishing = false;
  }

  /**
   * 显示奖励
   */
  private showReward(type: RewardType, id: number, amount: number) {
    if (!this.rewardPanel) {
      return;
    }

    this.rewardPanel.active = true;

    if (this.rewardNameLabel) {
      const typeName = this.rewardTypeNames[type];
      this.rewardNameLabel.string = `获得 ${typeName} x ${amount}`;
    }

    // TODO: 根据奖励id加载对应图标
    console.log('钓到奖励:', {type, id, amount});
  }

  /**
   * 关闭奖励面板
   */
  onCloseReward() {
    if (this.rewardPanel) {
      this.rewardPanel.active = false;
    }
  }

  /**
   * 点击增加次数（看广告）
   */
  private async onAddCountClick() {
    if (!this.userId) {
      return;
    }

    // 在微信小游戏中，这里触发激励视频广告
    // 广告看完后调用后端增加次数
    try {
      const res = await ApiManager.instance.addFishingCountByAd(this.userId);
      if (res.success && res.data) {
        this.loadRemainingCount();
        console.log('成功增加钓鱼次数');
      }
    } catch (e) {
      console.error('增加次数失败:', e);
    }
  }

  /**
   * 延时工具
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 返回主场景
   */
  private onBackClick() {
    // TODO: director.loadScene('MainScene');
    console.log('返回主场景');
  }
}
