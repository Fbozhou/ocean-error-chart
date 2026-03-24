import { _decorator, Component, Node, Label, Button, Sprite, UITransform, Layers } from 'cc';
import { ApiManager } from '../net/ApiManager';
import { UserInfo } from '../net/ApiManager';
const { ccclass, property } = _decorator;

/**
 * 登录/启动场景控制器
 */
@ccclass('LoginScene')
export class LoginScene extends Component {
  /** 游戏标题标签 */
  @property(Label)
  titleLabel: Label | null = null;

  /** 游戏简介标签 */
  @property(Label)
  descLabel: Label | null = null;

  /** 开始游戏按钮 */
  @property(Button)
  startButton: Button | null = null;

  /** 状态提示标签 */
  @property(Label)
  statusLabel: Label | null = null;

  /** 背景精灵 */
  @property(Sprite)
  bgSprite: Sprite | null = null;

  onLoad() {
    // 绑定按钮事件
    if (this.startButton) {
      this.startButton.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);
    }

    // 初始化文字
    if (this.titleLabel) {
      this.titleLabel.string = '海错图';
    }
    if (this.descLabel) {
      this.descLabel.string = '国风合成 · 收集海洋生物';
    }
    if (this.statusLabel) {
      this.statusLabel.string = '';
    }
  }

  start() {
    // 检查是否已有token，可以直接进入游戏
    const token = ApiManager.instance.getToken();
    if (token) {
      // 已有token，直接跳转到主场景
      this.updateStatus('已有登录信息，正在进入游戏...');
      // TODO: 加载主场景
      // director.loadScene('MainScene');
    } else {
      this.updateStatus('点击下方按钮开始游戏');
    }
  }

  /**
   * 更新状态提示
   */
  private updateStatus(text: string) {
    if (this.statusLabel) {
      this.statusLabel.string = text;
    }
    console.log(text);
  }

  /**
   * 开始游戏按钮点击
   */
  private async onStartButtonClick() {
    if (typeof wx === 'undefined') {
      // 编辑器环境，模拟登录成功
      this.updateStatus('编辑器环境，模拟登录成功...');
      // TODO: 跳转到主场景
      return;
    }

    this.updateStatus('正在微信登录...');

    try {
      // 调用微信登录
      const code = await new Promise<string>((resolve, reject) => {
        wx.login({
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取code失败'));
            }
          },
          fail: () => {
            reject(new Error('微信登录调用失败'));
          }
        });
      });

      if (!code) {
        this.updateStatus('微信登录失败，请重试');
        return;
      }

      this.updateStatus('正在验证登录...');

      // 调用后端登录接口
      const res = await ApiManager.instance.wxLogin(code);

      if (res.success && res.data && res.data.token && res.data.userInfo) {
        // 保存token
        ApiManager.instance.setToken(res.data.token);

        this.updateStatus(`登录成功！欢迎你，${res.data.userInfo.nickName}`);

        // 保存用户信息，跳转到主场景
        // TODO: director.loadScene('MainScene');
        console.log('User info:', res.data.userInfo);

        // 这里先打个日志，实际项目加载主场景
        setTimeout(() => {
          this.updateStatus('即将进入游戏...');
        }, 1000);
      } else {
        this.updateStatus(`登录失败: ${res.message || '未知错误'}`);
      }
    } catch (e) {
      this.updateStatus(`登录异常: ${e}`);
      console.error('Login error:', e);
    }
  }
}
