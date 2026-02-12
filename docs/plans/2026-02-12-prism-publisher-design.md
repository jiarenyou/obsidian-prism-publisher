# Prism Publisher 设计方案

**项目名称：** Obsidian Prism Publisher
**创建日期：** 2026-02-12
**设计目标：** 开发一款具有内容生命周期管理和智能发布策略的 Obsidian 多平台分发插件

---

## 1. 项目概述

### 1.1 项目定位
Prism Publisher 是一款旨在简化内容分发流程的 Obsidian 插件。与现有的 obsidian-note-publish 插件不同，本插件专注于：
- **内容生命周期管理**：追踪文章在各个平台的发布状态和历史
- **智能发布策略**：支持发布队列管理和优先级调度
- **完全自动化工作流**：在 Obsidian 内完成所有操作，无需手动跳转

### 1.2 核心价值
- 一次写作，一键分发到多个平台
- 自动追踪和管理各平台的发布状态
- 智能队列管理，优化发布效率
- 完整的发布历史记录

### 1.3 支持平台
- 微信公众号
- 知乎 (Zhihu)
- 掘金 (Juejin)
- 小红书 (Xiaohongshu)
- 语雀 (Yuque)

---

## 2. 整体架构

### 2.1 模块化分层架构

插件采用模块化设计，分为五个核心模块：

#### 平台适配器层 (Platform Adapters)
每个平台独立实现统一的适配器接口：
```typescript
interface PlatformAdapter {
  name: string;              // 平台名称
  authenticate(): Promise<boolean>;  // OAuth 认证
  publish(content: PublishContent): Promise<PublishResult>;  // 发布
  update(articleId: string, content: PublishContent): Promise<void>;  // 更新
  convertMarkdown(markdown: string): string;  // Markdown 转换
}
```

#### 认证管理器 (Auth Manager)
- 集中管理所有平台的 OAuth token
- 使用 Obsidian 的 `getDataPath()` 存储加密 token
- 提供 `refreshToken()` 自动刷新过期 token
- 支持一键授权/一键取消授权

#### 发布队列管理器 (Queue Manager)
- 维护用户手动排序的优先级队列
- 队列数据存储在笔记的 Frontmatter 中
- 提供拖拽排序界面调整优先级

#### 内容转换器 (Content Converter)
- 将 Markdown 转换为各平台兼容格式
- 处理图片上传（上传到图床并替换链接）
- 支持 Jinja2 模板自定义转换规则

#### 状态追踪器 (Status Tracker)
- 在 Frontmatter 中记录每个平台的发布状态
- 追踪发布时间、文章 URL、错误信息
- 支持跨平台状态同步

---

## 3. 数据结构设计

### 3.1 Frontmatter 元数据

每篇笔记的 Frontmatter 结构：

```yaml
---
title: "我的文章标题"
publish_config:
  platforms:
    - name: wechat
      enabled: true
      priority: 1
    - name: zhihu
      enabled: true
      priority: 2
    - name: xiaohongshu
      enabled: true
      priority: 3
  images:
    cdn: qiniu  # 使用的图床
    uploaded: true
    base_url: https://cdn.example.com

publish_status:
  wechat:
    status: published  # pending | publishing | published | failed
    article_id: "wx_xxxxx"
    url: "https://mp.weixin.qq.com/s/xxxxx"
    published_at: "2025-01-15T10:30:00Z"
    updated_at: "2025-01-15T10:30:00Z"
  zhihu:
    status: failed
    error: "API rate limit exceeded"
    retry_count: 2
    last_attempt: "2025-01-15T11:00:00Z"
  xiaohongshu:
    status: pending
---
```

### 3.2 插件全局设置 (data.json)

```json
{
  "accounts": {
    "wechat": {
      "access_token": "encrypted_token",
      "refresh_token": "encrypted_token",
      "expires_at": "2025-02-15T00:00:00Z",
      "app_id": "wx_app_id",
      "openid": "user_openid"
    },
    "zhihu": {
      "access_token": "encrypted_token",
      "refresh_token": "encrypted_token",
      "expires_at": "2025-02-15T00:00:00Z"
    }
  },
  "image_cdn": {
    "provider": "qiniu",
    "qiniu": {
      "access_key": "encrypted_key",
      "secret_key": "encrypted_key",
      "bucket": "my-bucket",
      "domain": "https://cdn.example.com"
    }
  },
  "publish_queue": [
    {
      "note_path": "/Articles/my-post.md",
      "platforms": ["wechat", "zhihu"],
      "scheduled_at": "2025-01-15T14:00:00Z"
    }
  ]
}
```

### 3.3 发布队列结构

```typescript
interface QueueItem {
  notePath: string;           // 笔记路径
  noteTitle: string;          // 笔记标题
  platforms: string[];         // 要发布的平台列表
  priority: number;           // 优先级 (1=最高)
  status: 'pending' | 'publishing' | 'completed' | 'failed';
  createdAt: string;          // ISO timestamp
  scheduledAt?: string;       // 定时发布时间（可选）
}
```

---

## 4. 用户交互流程

### 4.1 发布工作流

**阶段 1：准备发布**
1. 用户在 Obsidian 中打开一篇笔记
2. 点击命令面板，选择 "Prism: 分发到平台"
3. 弹出平台选择界面（多选框），用户勾选目标平台
4. 可选：调整平台优先级（拖拽排序）
5. 可选：预览每个平台的转换效果（侧边栏实时预览）

**阶段 2：OAuth 认证**
- 如果平台未授权，显示 "授权" 按钮
- 点击后打开本地 OAuth 窗口（使用 `electron` 的 `BrowserWindow`）
- 用户完成授权后，自动关闭窗口并保存 token
- 已授权的平台显示 "✓ 已授权" 状态

**阶段 3：内容处理**
- 自动上传本地图片到图床（优先使用用户配置的图床）
- 根据平台模板转换 Markdown 格式
- 生成平台特定的元数据（如：知乎的话题标签、微信的摘要）

**阶段 4：执行发布**
- 按照用户设定的优先级顺序发布
- 每个平台发布前，弹出确认框（可关闭自动确认）
- 实时显示进度：状态栏显示 "正在发布到微信 (1/4)..."
- 发布成功/失败后，立即更新笔记的 Frontmatter 状态

**阶段 5：结果反馈**
- 显示发布结果面板：成功平台（带 URL）、失败平台（带错误信息）
- 支持一键复制所有成功链接
- 失败平台支持 "重试" 按钮

### 4.2 队列管理工作流

**添加到队列**
- 在发布面板中，选择 "添加到队列" 而非 "立即发布"
- 设置优先级和调度时间（可选）
- 队列项保存到插件设置中

**管理队列**
- 打开队列管理界面（插件设置 -> 发布队列）
- 拖拽调整优先级
- 点击 "立即发布" 开始发布
- 支持编辑或删除队列项

---

## 5. 技术实现

### 5.1 技术栈

**核心依赖**
- Obsidian Plugin API - 基础插件框架
- Electron - OAuth 认证窗口
- axios - HTTP 请求
- dayjs - 时间处理
- js-yaml - Frontmatter 解析

**图床支持**
- 七牛云 (Qiniu)
- 阿里云 OSS (Aliyun OSS)
- 腾讯云 COS (Tencent COS)
- SM.MS

### 5.2 OAuth 2.0 认证流程

```
1. 插件启动本地 OAuth 服务器 (http://localhost:3456)
2. 打开浏览器窗口 -> 平台授权页
3. 用户授权后，平台回调到 localhost
4. 插件截取 code，换取 access_token
5. 保存 token 到本地加密存储
```

### 5.3 图片上传策略

- 支持多种图床配置
- 用户可配置多个图床，自动负载均衡
- 上传时使用异步并发，提升速度
- 自动替换 Markdown 中的本地图片链接

### 5.4 错误处理策略

- **网络错误**：自动重试 3 次，指数退避
- **API 错误**：解析错误码，给出明确的用户提示
- **Token 过期**：自动刷新并重试
- **发布失败**：标记状态，保存错误信息到 Frontmatter

---

## 6. UI 界面设计

### 6.1 发布面板
位置：笔记右侧面板
- 上半部分：平台选择（多选框 + 拖拽排序）
- 下半部分：预览区（实时显示转换后的内容）
- 底部按钮：
  - "开始发布" 按钮（主要操作）
  - "预览所有平台" 链接
  - "查看历史发布记录" 链接

### 6.2 发布进度弹窗
显示实时进度，包括：
- ✓ 已完成的平台（带链接）
- ⟳ 正在发布的平台（进度条）
- ○ 等待中的平台
- [取消发布] [后台运行] 按钮

### 6.3 发布结果面板
```
成功 (3/4)
• 微信公众号  [查看]
• 知乎        [查看]
• 语雀        [查看]

失败 (1/4)
• 小红书      API 错误
              [重试]

[复制所有链接] [关闭]
```

### 6.4 队列管理界面
位置：插件设置 -> "发布队列" 标签页
- 表格显示所有队列项
- 支持拖拽调整优先级
- 每行显示：笔记标题、目标平台、状态、操作按钮

### 6.5 账号管理界面
位置：插件设置 -> "平台账号" 标签页
- 每个平台显示授权状态卡片
- 已授权：显示用户名 + [重新授权] [取消授权]
- 未授权：显示 [立即授权] 按钮

### 6.6 状态栏集成
- 待机时：🌈 (彩色棱镜图标)
- 发布中：🌐⟳ (带旋转动画)
- 点击图标：打开队列管理界面

---

## 7. 关键功能特性

### 7.1 内容生命周期管理
- ✅ 追踪每篇文章在各个平台的发布状态
- ✅ 记录发布时间、文章 URL、更新历史
- ✅ 支持跨平台同步更新（修改 Obsidian 笔记后一键更新所有平台）
- ✅ 版本历史对比（查看哪些平台还在用旧版本）

### 7.2 智能发布策略
- ✅ 手动优先级排序（拖拽调整）
- ✅ 发布队列管理（批量添加到队列）
- ✅ 定时发布支持（可选功能）

### 7.3 差异化优势

对比 obsidian-note-publish：
| 特性 | obsidian-note-publish | Prism Publisher |
|------|----------------------|-----------------|
| 状态追踪 | ❌ | ✅ 完整的生命周期管理 |
| 队列管理 | ❌ | ✅ 优先级队列 + 定时发布 |
| OAuth 认证 | ❌ | ✅ 一键授权登录 |
| 跨平台更新 | ❌ | ✅ 一键同步更新所有平台 |
| 发布历史 | ❌ | ✅ 完整的历史记录 |

---

## 8. 开发计划

### 8.1 核心功能优先级

**Phase 1: 基础框架**
- [ ] 搭建插件基础结构
- [ ] 实现 Frontmatter 读写
- [ ] 实现平台适配器接口
- [ ] 实现认证管理器

**Phase 2: 平台集成**
- [ ] 实现微信公众号适配器
- [ ] 实现知乎适配器
- [ ] 实现掘金适配器
- [ ] 实现语雀适配器
- [ ] 实现小红书适配器（浏览器自动化）

**Phase 3: UI 开发**
- [ ] 开发发布面板
- [ ] 开发进度弹窗
- [ ] 开发结果面板
- [ ] 开发队列管理界面
- [ ] 开发账号管理界面

**Phase 4: 高级功能**
- [ ] 实现图片上传功能
- [ ] 实现发布队列系统
- [ ] 实现跨平台更新功能
- [ ] 实现发布历史记录

### 8.2 技术挑战

1. **小红书平台**：无官方 API，需要使用 Playwright/Puppeteer 进行浏览器自动化
2. **OAuth 认证**：各平台的 OAuth 流程差异较大，需要逐个适配
3. **图片上传**：需要支持多种图床，且要处理并发上传
4. **状态同步**：确保 Frontmatter 的更新与插件设置的一致性

---

## 9. 后续扩展可能性

### 9.1 潜在功能
- AI 辅助生成平台特定的标题、摘要、标签
- 数据分析：跨平台阅读量统计聚合
- 协作功能：多人管理同一账号
- 模板市场：用户自定义内容转换模板

### 9.2 优化方向
- 发布效果分析（哪个平台效果最好）
- 最佳发布时间建议
- 内容智能适配（根据平台调性自动调整语气）

---

## 10. 总结

本设计方案定义了一个具有内容生命周期管理和智能发布策略的 Obsidian 多平台分发插件。通过模块化架构、清晰的数据结构和用户友好的 UI 设计，Prism Publisher 将为用户提供高效、可靠的内容分发体验。

**核心优势**：
- 完整的内容生命周期追踪
- 智能的发布队列管理
- 一站式的自动化工作流
- 与现有产品的差异化定位

**下一步**：准备创建 git worktree 并开始实施。
