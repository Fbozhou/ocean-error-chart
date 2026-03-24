/**
 * 海洋生物等级配置
 */
export interface MarineCreature {
  /** 生物ID，唯一标识 */
  id: number;
  /** 生物名称 */
  name: string;
  /** 等级，1-30 */
  level: number;
  /** 海域ID，对应解锁海域 */
  areaId: number;
  /** 预制体路径 */
  prefabPath: string;
  /** 图标纹理路径 */
  iconPath: string;
  /** 《海错图》/《山海经》科普文案 */
  description: string;
  /** 合成后获得的饵料数量 */
  mergeReward: number;
}

/**
 * 海域配置
 */
export interface SeaArea {
  /** 海域ID */
  id: number;
  /** 海域名称 */
  name: string;
  /** 解锁需要的最低生物等级 */
  unlockRequireLevel: number;
  /** 背景图片路径 */
  backgroundPath: string;
}

/**
 * 全局生物数据配置
 */
export class MarineConfig {
  private static _instance: MarineConfig;
  public static get instance(): MarineConfig {
    if (!this._instance) {
      this._instance = new MarineConfig();
    }
    return this._instance;
  }

  /** 生物列表 */
  private creatureList: MarineCreature[] = [];
  /** 生物ID映射 */
  private creatureMap: Map<number, MarineCreature> = new Map();
  /** 海域列表 */
  private areaList: SeaArea[] = [];
  /** 海域ID映射 */
  private areaMap: Map<number, SeaArea> = new Map();

  private constructor() {
    this.initDefaultData();
  }

  /**
   * 初始化默认数据，后续可从后端拉取
   */
  private initDefaultData() {
    // 初始化3个海域
    this.addArea({
      id: 1,
      name: "近海浅滩",
      unlockRequireLevel: 1,
      backgroundPath: "textures/areas/area1",
    });
    this.addArea({
      id: 2,
      name: "远洋深海",
      unlockRequireLevel: 10,
      backgroundPath: "textures/areas/area2",
    });
    this.addArea({
      id: 3,
      name: "神幻海域",
      unlockRequireLevel: 20,
      backgroundPath: "textures/areas/area3",
    });

    // 1级 - 磷虾
    this.addCreature({
      id: 1,
      name: "磷虾",
      level: 1,
      areaId: 1,
      prefabPath: "prefabs/creatures/c1",
      iconPath: "icons/c1",
      description: "海错图记载：虾生海中，微小如磷，群游水面，夜生光芒。",
      mergeReward: 1,
    });

    // 后续会批量生成2-30级数据
  }

  private addCreature(creature: MarineCreature) {
    this.creatureList.push(creature);
    this.creatureMap.set(creature.id, creature);
  }

  private addArea(area: SeaArea) {
    this.areaList.push(area);
    this.areaMap.set(area.id, area);
  }

  /** 根据ID获取生物 */
  public getCreature(id: number): MarineCreature | undefined {
    return this.creatureMap.get(id);
  }

  /** 根据等级获取下一级生物ID */
  public getNextLevelCreatureId(level: number): number | undefined {
    const creature = this.creatureList.find(c => c.level === level + 1);
    return creature?.id;
  }

  /** 获取所有生物 */
  public getAllCreatures(): MarineCreature[] {
    return this.creatureList;
  }

  /** 获取所有海域 */
  public getAllAreas(): SeaArea[] {
    return this.areaList;
  }

  /** 根据ID获取海域 */
  public getArea(id: number): SeaArea | undefined {
    return this.areaMap.get(id);
  }
}
