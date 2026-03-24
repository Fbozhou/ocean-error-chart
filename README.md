# 海错图 - 国风合成微信小游戏

> 基于《海错图》+《山海经》打造的国风合成休闲微信小游戏

## 项目分工
| 角色 | 负责人 |
|------|--------|
| 项目经理虾（测试） | @大萌虾1 |
| 需求虾 | @栋栋虾 |
| 后端开发虾 | @rzf的智能助手 |
| 前端开发虾 | @前端大虾 |

## 技术选型
- 游戏引擎：**Cocos Creator 3.x**
- 开发语言：TypeScript
- 目标平台：微信小游戏

## 项目结构
```
ocean-error-chart/
├── assets/
│   ├── scenes/            # 场景文件
│   │   ├── Boot.scene     # 启动场景
│   │   ├── Main.scene     # 合成主场景
│   │   ├── Handbook.scene # 图鉴场景
│   │   ├── Garden.scene   # 海底小院场景
│   │   └── Fishing.scene  # 每日钓鱼场景
│   ├── scripts/
│   │   ├── core/          # 核心数据结构
│   │   │   └── MarineData.ts # 生物配置数据
│   │   ├── game/          # 游戏核心逻辑
│   │   │   ├── MergeBoard.ts  # 合成棋盘
│   │   │   └── CreatureCell.ts # 单个生物单元格
│   │   ├── ui/            # 各个场景UI脚本
│   │   │   ├── MainScene.ts
│   │   │   ├── HandbookScene.ts
│   │   │   ├── GardenScene.ts
│   │   │   └── FishingScene.ts
│   │   └── net/           # 网络请求
│   │       └── ApiManager.ts # API接口管理
│   ├── resources/         # 资源文件
│   └── textures/          # 纹理图片
├── build/                 # 微信小游戏构建输出
└── package.json
```

## 开发环境准备
1. 安装 [Cocos Creator 3.x](https://www.cocos.com/creator)
2. 克隆本项目
3. 使用 Cocos Creator 打开项目
4. 在 项目 → 项目构建 中选择「微信小游戏」平台，配置 appid
5. 构建之后，使用微信开发者工具打开 `build/wechat-miniprogram` 目录进行调试

## 功能模块
- ✅ 核心合成玩法（5x5棋盘拖拽合成）
- ✅ 海错图图鉴收集 + 科普文案
- ✅ 海底小院神兽放置展示
- ✅ 每日钓鱼奇遇
- ✅ 社交裂变蹭饵料
- ✅ 离线收益

## 性能要求
- 包体大小 ≤ 10MB
- 加载时间 ≤ 3s
- 低端机运行帧率 ≥ 30FPS
- 兼容 iOS 12+ / Android 8+

## 开发进度
- [x] 项目框架搭建
- [x] 核心合成玩法开发
- [x] UI场景脚本制作
- [x] 后端API对接
- [ ] 编辑器场景创建绑定
- [ ] 性能优化
- [ ] 真机测试
- [ ] 提交审核

### 已完成脚本文件
| 模块 | 文件 | 状态 |
|------|------|------|
| 核心数据 | `assets/scripts/core/MarineData.ts` | ✅ |
| 合成逻辑 | `assets/scripts/game/MergeBoard.ts` | ✅ |
| 拖拽交互 | `assets/scripts/game/CreatureCell.ts` | ✅ |
| API管理 | `assets/scripts/net/ApiManager.ts` | ✅ 已适配后端 |
| 登录启动页 | `assets/scripts/ui/LoginScene.ts` | ✅ |
| 主合成场景 | `assets/scripts/ui/MainScene.ts` | ✅ |
| 海域选择 | `assets/scripts/ui/SeaAreaScene.ts` | ✅ |
| 海错图图鉴 | `assets/scripts/ui/HandbookScene.ts` | ✅ |
| 海底小院 | `assets/scripts/ui/GardenScene.ts` | ✅ |
| 每日钓鱼 | `assets/scripts/ui/FishingScene.ts` | ✅ |

## 后端API地址
开发环境：`http://dev-api.your-domain.com/api`
生产环境：`https://api.your-domain.com/api`

修改位置：`assets/scripts/net/ApiManager.ts` 中 `baseUrl`
