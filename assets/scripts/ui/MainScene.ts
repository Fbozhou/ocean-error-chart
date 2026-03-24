import { _decorator, Component, Node, Label, Button } from 'cc';
import { ApiManager } from '../net/ApiManager';
import { MergeBoard } from '../game/MergeBoard';
import { MarineConfig } from '../core/MarineData';
const { ccclass, property } = _decorator;

/**
 * 主场景控制器
 */
@ccclass('MainScene')
export class MainScene extends Component {
  /** 饵料数量显示 */
  @property(Label)
  baitLabel: Label | null = null;

  /** 合成棋盘 */
  @property(MergeBoard)
  mergeBoard: MergeBoard | null = null;

  /** 自动整理按钮 */
  @property(Button)
  organizeButton: Button | null = null;

  /** 图鉴按钮 */
  @property(Button)
  handbookButton: Button | null = null;

  /** 庭院按钮 */
  @property(Button)
  gardenButton: Button | null = null;

  /** 钓鱼按钮 */
  @property(Button)
  fishingButton: Button | null = null;

  /** 当前用户饵料 */
  private currentBait: number = 0;

  onLoad() {
    // 绑定按钮事件
    if (this.organizeButton) {
      this.organizeButton.node.on(Button.EventType.CLICK, this.onOrganizeClick, this);
    }
    if (this.mergeBoard) {
      this.mergeBoard.onMergeComplete = this.onMergeComplete.bind(this);
    }

    // 微信分享配置
    if (typeof wx !== 'undefined') {
      wx.onShareAppMessage(() => {
        return {
          title: '来海错图和我一起合成神奇海洋生物！',
          imageUrl: 'share.jpg',
        };
      });
    }
  }

  start() {
    // 登录后拉取用户数据
    this.loginAndLoadData();
  }

  /**
   * 微信登录并加载数据
   */
  private async loginAndLoadData() {
    if (typeof wx === 'undefined') {
      // 编辑器环境，初始化默认数据
      this.currentBait = 10;
      this.updateBaitDisplay();
      // 初始化棋盘，放一个磷虾
      this.spawnInitialCreatures();
      return;
    }

    try {
      const loginRes = await new Promise<string>((resolve) => {
        wx.login({
          success: (res) => resolve(res.code),
          fail: () => resolve(''),
        });
      });

      if (!loginRes) {
        console.error('微信登录失败');
        return;
      }

      const apiRes = await ApiManager.instance.wxLogin(loginRes);
      if (apiRes.success && apiRes.data) {
        this.currentBait = apiRes.data.userInfo.bait;
        this.updateBaitDisplay();
        // 加载棋盘数据
        this.loadUserData();
      }
    } catch (e) {
      console.error('登录异常', e);
    }
  }

  /**
   * 初始化生物（新手引导）
   */
  private spawnInitialCreatures() {
    if (!this.mergeBoard) return;
    // 默认放两个1级磷虾
    const empty1 = this.mergeBoard.findEmptyCell();
    if (empty1) {
      // 后续从对象池获取预制体，这里只是占位
      // this.mergeBoard.placeCreature(empty1.x, empty1.y, 1, this.prefabC1);
    }
    const empty2 = this.mergeBoard.findEmptyCell();
    if (empty2) {
      // this.mergeBoard.placeCreature(empty2.x, empty2.y, 1, this.prefabC1);
    }
  }

  /**
   * 加载用户数据
   */
  private async loadUserData() {
    // 从后端加载棋盘数据、用户数据
    // 略... 等待后端接口
  }

  /**
   * 更新饵料显示
   */
  private updateBaitDisplay() {
    if (this.baitLabel) {
      this.baitLabel.string = `饵料: ${this.currentBait}`;
    }
  }

  /**
   * 自动整理按钮点击
   */
  private onOrganizeClick() {
    if (this.mergeBoard) {
      this.mergeBoard.autoOrganize();
    }
  }

  /**
   * 合成完成回调
   */
  private onMergeComplete(newCreatureId: number, x: number, y: number) {
    // 处理新生物生成，播放合成动画
    // 奖励饵料
    const config = MarineConfig.instance.getCreature(newCreatureId);
    if (config) {
      this.currentBait += config.mergeReward;
      this.updateBaitDisplay();
    }

    // 放置新生物
    // 从对象池获取预制体放置
    // this.mergeBoard.placeCreature(x, y, newCreatureId, prefab);

    // 检查是否解锁图鉴，发送后端记录
    // ...
  }

  /**
   * 减少饵料（用于购买新生物）
   */
  public consumeBait(amount: number): boolean {
    if (this.currentBait >= amount) {
      this.currentBait -= amount;
      this.updateBaitDisplay();
      return true;
    }
    return false;
  }

  /**
   * 增加饵料
   */
  public addBait(amount: number) {
    this.currentBait += amount;
    this.updateBaitDisplay();
  }
}
