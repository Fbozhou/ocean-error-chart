/**
 * API 响应结构
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * 用户信息
 */
export interface UserInfo {
  userId: string;
  nickName: string;
  avatarUrl: string;
  currentAreaId: number;
  totalLevel: number;
  bait: number;
}

/**
 * 合成请求
 */
export interface MergeRequest {
  userId: string;
  fromId1: number;
  fromId2: number;
  position: {x: number, y: number};
}

/**
 * 合成响应
 */
export interface MergeResponse {
  success: boolean;
  newCreatureId: number;
  rewardBait: number;
  unlockAchievement?: boolean;
}

/**
 * 钓鱼响应
 */
export interface FishingResponse {
  rewardType: 'bait' | 'creature' | 'fragment';
  rewardId: number;
  amount: number;
}

/**
 * 网络请求管理器
 */
export class ApiManager {
  private static _instance: ApiManager;
  public static get instance(): ApiManager {
    if (!this._instance) {
      this._instance = new ApiManager();
    }
    return this._instance;
  }

  /** 后端API基础URL */
  private baseUrl: string = "http://8.130.13.38:8080/ocean-error-chart/api";

  /** 当前认证token */
  private token: string | null = null;

  private constructor() {
    // 从本地存储恢复token
    this.token = wx.getStorageSync('auth_token') || null;
  }

  /** 设置API地址 */
  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /** 获取当前token */
  public getToken(): string | null {
    return this.token;
  }

  /** 设置token并保存到本地 */
  public setToken(token: string) {
    this.token = token;
    wx.setStorageSync('auth_token', token);
  }

  /** 清除token */
  public clearToken() {
    this.token = null;
    wx.removeStorageSync('auth_token');
  }

  /** 微信登录 */
  public async wxLogin(code: string): Promise<ApiResponse<{token: string, userInfo: UserInfo}>> {
    return this.post("/user/wx-login", {code});
  }

  /** 获取用户数据 */
  public async getUserInfo(userId: string): Promise<ApiResponse<UserInfo>> {
    return this.get(`/user/info/${userId}`);
  }

  /** 领取离线收益 */
  public async claimOfflineReward(userId: string): Promise<ApiResponse<{bait: number}>> {
    return this.post(`/user/collect-offline-income/${userId}`, {});
  }

  /** 合成生物 */
  public async mergeCreature(data: MergeRequest): Promise<ApiResponse<MergeResponse>> {
    return this.post("/combine/do", data);
  }

  /** 获取用户生物列表 */
  public async getUserCombinedList(userId: string): Promise<ApiResponse<number[]>> {
    return this.get(`/combine/user-list/${userId}`);
  }

  /** 获取全量生物配置 */
  public async getAllCreatureList(): Promise<ApiResponse<any[]>> {
    return this.get("/combine/all-list");
  }

  /** 解锁海域 */
  public async unlockSeaArea(userId: string, seaAreaId: number): Promise<ApiResponse<boolean>> {
    return this.post(`/combine/unlock-sea-area/${userId}/${seaAreaId}`, {});
  }

  /** 获取图鉴列表 */
  public async getIllustrationList(userId: string): Promise<ApiResponse<number[]>> {
    return this.get(`/illustration/list/${userId}`);
  }

  /** 获取图鉴统计 */
  public async getIllustrationStats(userId: string): Promise<ApiResponse<{total: number, unlocked: number}>> {
    return this.get(`/illustration/stats/${userId}`);
  }

  /** 获取庭院信息 */
  public async getYardInfo(userId: string): Promise<ApiResponse<number[]>> {
    return this.get(`/yard/${userId}`);
  }

  /** 放置神兽到庭院 */
  public async placeYardCreature(userId: string, creatureId: number, position: {x: number, y: number}): Promise<ApiResponse<boolean>> {
    return this.post("/yard/place", {userId, creatureId, position});
  }

  /** 解锁庭院槽位 */
  public async unlockYardSlot(userId: string, slotId: number, cost: number): Promise<ApiResponse<boolean>> {
    return this.post(`/yard/unlock/${userId}/${slotId}/${cost}`, {});
  }

  /** 蹭好友饵料 */
  public async stealBait(userId: string, friendId: string): Promise<ApiResponse<{bait: number}>> {
    return this.post(`/social/steal/${userId}/${friendId}`, {});
  }

  /** 检查是否可蹭饵料 */
  public async canSteal(userId: string): Promise<ApiResponse<boolean>> {
    return this.get(`/social/can-steal/${userId}`);
  }

  /** 分享奖励 */
  public async claimShareReward(userId: string): Promise<ApiResponse<{bait: number}>> {
    return this.post(`/social/share-reward/${userId}`, {});
  }

  /** 每日钓鱼 */
  public async doFishing(userId: string): Promise<ApiResponse<FishingResponse>> {
    return this.post(`/fish/do/${userId}`, {});
  }

  /** 获取剩余钓鱼次数 */
  public async getFishingRemaining(userId: string): Promise<ApiResponse<{count: number}>> {
    return this.get(`/fish/remaining/${userId}`);
  }

  /** 广告增加钓鱼次数 */
  public async addFishingCountByAd(userId: string): Promise<ApiResponse<boolean>> {
    return this.post(`/fish/add-by-ad/${userId}`, {});
  }

  /** GET请求 */
  private async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request(path, null, "GET");
  }

  /** POST请求 */
  private async post<T>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.request(path, data, "POST");
  }

  /** 通用请求封装 */
  private async request<T>(path: string, data: any, method: "GET" | "POST"): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const url = this.baseUrl + path;
      const header: any = {
        "content-type": "application/json",
      };

      // 如果有token，添加Authorization header
      if (this.token) {
        header["Authorization"] = `Bearer ${this.token}`;
      }

      const options: any = {
        url: url,
        method: method,
        header: header,
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data as ApiResponse<T>);
          } else {
            reject(new Error(`Request failed with status ${res.statusCode}`));
          }
        },
        fail: (err: any) => {
          reject(err);
        }
      };

      // POST请求才需要data
      if (method === "POST" && data) {
        options.data = data;
      }

      wx.request(options);
    });
  }
}
