你是一名负责前端实现的编程 agent。请根据我提供的 3 份参考文档与当前项目上下文，实现 `project-portal` 网页项目。

你必须首先完整阅读并吸收以下文档：
- 01_project_portal_IA.md
- 02_project_portal_fields_and_templates.md
- 系列风格.md


这不是自由发挥做一个“好看的网站”，而是要严格实现一个：
- 面向课程汇报、跨组协作、进度跟踪、文档索引、过程留痕的 portal
- 风格上属于我们已有网页系列，简洁好看 
- 技术上尽量简单、干净、可维护
- 适合一个正在学习 Vite + React + TypeScript 的人后续接手

--------------------------------------------------
一、项目身份与边界（必须严格遵守）
--------------------------------------------------

1. `project-portal` 不是主产品网页。
2. `project-portal` 不是招募宣传页。
3. `project-portal` 的定位是：
   “Limb Motion Recognition and Assistant 项目的过程展示、协作索引与交付中枢站”
4. 它必须回答以下问题：
   - 这是什么项目？
   - 当前做到哪里？
   - 各小组分别负责什么？
   - 文档、会议、日志、里程碑、交付物在哪里？
   - M2 在整体项目中的职责、边界、依赖和可见产出是什么？
5. 不允许把 `project-main-web` 冒充为 portal 的内容。
6. 不允许把别人负责的主产品前端成果写成由 portal 提供。
7. `m2-recruitment-site` 是已经完成的历史成果，应作为 archive / related repo 展示，不应抢 portal 主叙事。
8. 我们是 M2 组。我们当前明确负责：
   - `project-portal` 的开发与维护
   - 与 M2 相关的临床 dashboard / portal 可见网页前端叙事与展示
   - 但不是整个大项目所有网页

--------------------------------------------------
二、技术栈与实现总原则
--------------------------------------------------

技术栈固定为：
- Vite
- React
- TypeScript
- Tailwind CSS
- i18next + react-i18next

新增允许项（本项目明确需要）：
- react-router-dom（因为这里明确有多页面结构）
- FullCalendar React 版（用于项目月历页）
- react-markdown
- remark-gfm
- rehype-slug
- rehype-autolink-headings
- gray-matter
- 一个轻量文件扫描/构建脚本依赖（如 fast-glob 或 Node 原生 fs + glob 方案）
- 可选：一个轻量的 bionic reading 本地实现（如 js-bionic-reading / text-vide），但必须默认关闭，且仅用于长文阅读辅助

严禁：
- 重型 UI 库
- 重型动画库
- 状态管理库
- 炫技型图表库滥用
- 粒子背景
- 自动轮播
- 大范围 parallax
- 首屏夸张 hero 动效
- 为了“高级感”而做的复杂难懂封装

优先级原则：
1. 信息架构正确
2. 内容与前端解耦
3. 可读性
4. 低动效、高稳定
5. 视觉统一
6. 易维护

--------------------------------------------------
三、整体风格与系列页继承要求
--------------------------------------------------

这个页面必须继承我们现有系列页的视觉语言，而不是另起炉灶。

必须继承的风格特征：
- 浅色整体背景
- 非常柔和的多层 radial gradient 背景
- 轻量液态玻璃 / 半透明白卡
- 内容优先，玻璃感只作气氛，不抢阅读
- 主 section 使用统一的 `.section-shell`
- 内容玻璃卡片使用 `.glass-panel`
- lead/说明块使用 `.highlight-panel`
- 标签使用 `.chip`
- Header / Footer / SectionTitle 的总体语法尽量与系列页统一
- 低动效、轻过渡
- 正式、清楚、可信、工程化、国际协作气质

必须避免：
- 全屏 Hero 大字霸屏
- 强营销感 slogan
- “科技展会”风格
- 霓虹、赛博朋克
- 大面积插画
- 过度视觉噱头

文字层级要求：
- H1 可较大，但不能夸张，约 text-4xl ~ text-5xl
- H2 正常 section 标题层级
- 正文 0.98rem ~ 1rem 左右，行高偏宽松
- lead 文案应清楚，不空泛
- 可以有少量抓手式大字，但只能作为局部阅读引导，不能喧宾夺主

可读性增强要求：
- 正文排版必须明显优于 proposal 网页
- 允许少量大字抓手、弱对比强调、文本 highlight、icon
- 允许在日志/文档详情页中加入“阅读辅助模式”
- Bionic reading / ReadableText 必须默认关闭，仅作为可选增强
- 阅读增强只能作用于长文主体，不要污染导航、按钮、表格、时间线、结构图

--------------------------------------------------
四、路由与页面结构（必须实现）
--------------------------------------------------

必须使用多页面路由结构。建议使用 BrowserRouter。

页面至少包括：

1. `/`
   首页总览页

2. `/progress`
   进度页

3. `/logs`
   日志总览页

4. `/logs/:slug`
   单篇日志/周报/会议/研究记录详情页

5. `/docs`
   文档与交付物总览页

6. `/architecture`
   架构与依赖说明页

7. `/calendar`
   月历页（重点新增）

可选增强页：
- `/docs/:slug`
- `/archive`
- `/tags/:tag`
- `/teams/:teamId`

如果时间有限，优先保证前 7 个。

--------------------------------------------------
五、首页 `/` 必须实现的板块
--------------------------------------------------

首页必须是“项目中枢总览”，不是博客首页，也不是产品首页。

从上到下建议实现：

A. Top Status Bar
- 项目名
- 课程名 / 学期
- Current Sprint / Iteration
- Last Updated
- 快速入口：
  - Main Web
  - Portal Repo
  - Recruitment Site
  - Docs
  - Demo（可占位）

B. Project Positioning
- 总项目一句话
- portal 一句话
- M2 边界说明
- 右侧 4 张摘要卡：System / Progress / Docs / Teams

C. Project System Map
- 三层：Sensor / Server / Monitor
- 六组：S1 / S2 / V1 / V2 / M1 / M2
- 接口：IF1 / IF2
- 当前三个仓库：
  - project-main-web
  - project-portal
  - m2-recruitment-site
- M2 可轻微高亮，但不能霸屏
- 点击节点可展示职责 / 依赖 / 仓库 / 状态

D. Current Progress Snapshot
- Current Sprint
- This Sprint Goal
- Completed
- In Progress
- Next Milestone
- Risks / Blockers

E. Latest Updates
- 最近 5~8 条
- 每条有：
  - 日期
  - 类型
  - 标题
  - ownerRole
  - 摘要
  - 证据链接
- 提供 View all logs

F. Deliverables Hub Preview
- Requirements
- System Design
- Interface / API
- Testing
- Presentation / Slides
- Meeting Minutes
- Weekly Reports
- Demo / Screenshots
- Research Notes

G. Teams & Repositories Map
- 六组职责卡
- 三个仓库职责卡
- 友链区（见后文）

H. M2 Contribution
- M2 职责
- portal 维护范围
- 与 V2 / M1 / 其他组的依赖
- 当前完成事项
- 当前未覆盖事项

I. Footer
- 项目名
- 学期信息
- Maintained by M2
- GitHub / Docs / Demo / Recruitment
- Last updated
- License（与仓库许可证一致）

--------------------------------------------------
六、`/progress` 页面
--------------------------------------------------

必须聚焦时间维度和阶段状态。

至少实现以下块：

A. Progress Overview
- 当前阶段
- 距下一个 milestone 还有多久
- 本阶段目标
- 当前风险

B. Gantt / Timeline
- official milestones
- actual progress
- delayed / at risk / completed

C. Milestones List
字段：
- title
- date / range
- owner
- status
- evidence link

D. Sprint Summaries
按 sprint 展示：
- goal
- completed
- incomplete
- blockers
- next step

E. Risk Register
字段：
- riskId
- title
- severity
- owner
- status
- mitigation
- lastUpdated

要求：
- 不要把整个页面做成单纯的大表格
- 保持清晰的时间线 / 卡片 / 简洁进度组合
- 可以有筛选：all / current / completed / at-risk

--------------------------------------------------
七、`/logs` 页面与详情页
--------------------------------------------------

这是过程留痕中心，必须做得可读、可筛选、可分享。

内容类型至少包括：
- Update
- Weekly Report
- Meeting
- Decision
- Interface
- Test
- Demo
- Research

列表页必须支持：
- 倒序时间流
- 类型筛选
- ownerRole 筛选
- sprint 筛选
- related team 筛选
- tag 筛选
- text search（可选增强）

单篇详情页必须支持：
- 标题
- 日期
- type
- owner / ownerRole
- relatedTeams
- relatedRepos
- sprint
- tags
- summary
- 正文 markdown
- actionItems
- evidence / attachments
- “Copy link” 按钮
- heading anchors
- 上一篇 / 下一篇（可选）

文章可读性要求：
- 正文最大宽度适中，不要太宽
- 标题、lead、metadata 清楚
- 支持表格、task list、blockquote、code block、horizontal rule
- 支持 heading anchor 直接跳转
- 支持 URL 直接分享具体位置，例如：
  - `/logs/prior-dsd-portal-patterns`
  - `/logs/prior-dsd-portal-patterns#design-decisions-derived`

研究类内容必须被当成正式内容类型，而不是埋在仓库深处的附录。

--------------------------------------------------
八、`/docs` 页面
--------------------------------------------------

这是正式文档和交付物入口中心。

分类至少包括：
- Requirement Analysis
- System Design
- Interface / API
- Testing
- Presentation
- Demo Assets
- Meeting Minutes
- Weekly Reports
- Research / Design Rationale

每个文档卡必须包含：
- title
- type
- version
- owner
- lastUpdated
- reviewStatus
- abstract
- link

状态标签：
- Draft
- In Review
- Final
- Archived

要求：
- 有分类导航
- 有按最近更新排序
- archived 与 current 必须视觉区分
- 允许文档详情跳到外链或仓库文件
- 不要变成一堆普通蓝色链接列表

--------------------------------------------------
九、`/architecture` 页面
--------------------------------------------------

这是“把结构讲透”的页面。

必须包括：

A. Overall System Overview
- Sensor / Server / Monitor
- data flow 简图

B. Team Responsibility Matrix
字段：
- teamName
- responsibility
- primaryInputs
- primaryOutputs
- dependsOn
- dependedBy

C. Repository Map
- repoName
- role
- maintainedBy
- status
- dependencies

D. Interface Dependencies
- IF1 / IF2
- 数据来源
- 数据去向
- M2 消费哪些结果
- 与 V2 / M1 / 其他队的关系

E. Role Matrix
- PM
- Vice PM
- Architect
- Programmer
- Tester
- Liaison

要求：
- 不要做成复杂可视化工具
- 用简洁系统图 + 卡片 + matrix 就够
- M2 的边界必须写清楚

--------------------------------------------------
十、`/calendar` 页面（重点新增）
--------------------------------------------------

必须新增一个月历页面。

目标：
- 适应跨国协作
- 展示 milestone / meeting / deadline / public holidays
- 有中葡时区显示
- 清楚、克制、可读
- 便于老师/队友快速查看时间安排

技术要求：
- 使用 FullCalendar React 版
- 仅实现必要视图，首选 `dayGridMonth`
- 做成“翻页月历”：上月 / 下月 / Today
- 不要引入 FullCalendar 的复杂高级功能
- 禁用拖拽编辑，portal 不是日程管理器

日历内容类型：
- milestone
- meeting
- deadline
- holiday-cn
- holiday-pt
- demo
- sprint-boundary（可选）

日历交互：
- 顶部工具栏：
  - prev
  - next
  - today
  - 当前月标题
  - 类型筛选 chips
- 点击某一天：
  - 右侧或下方显示当天事件列表
- 点击某个事件：
  - 打开详情抽屉 / 侧栏 / 弹层
  - 显示：
    - title
    - type
    - date/time
    - related team
    - summary
    - link
    - tags
- 事件颜色要克制，不花

假期要求：
- 中国公共假期
- 葡萄牙公共假期
- 假期数据必须静态化
- 不能依赖运行时在线请求
- 推荐方案：
  - 提供一个 Node 脚本，在构建前获取假期数据并生成静态 JSON
  - 若获取失败，站点仍可用，回退到仓库中已有 JSON
- 年份至少支持当前年和下一年

时区功能：
- 在同一页面展示：
  - China Time（Asia/Shanghai）
  - Portugal Time（Europe/Lisbon）
  - Local Time（用户本地，可选）
- 时钟实时刷新
- 使用浏览器原生 Intl.DateTimeFormat
- 风格简洁，不做大数字钟

额外要求：
- 事件详情最好能 deep-link
- 例如 `/calendar#2026-04-15-demo-review`
- 若实现复杂，可至少支持点开详情后 URL 更新 hash

--------------------------------------------------
十一、三语静态国际化策略（必须照做）
--------------------------------------------------

语言：
- zh-CN
- en
- pt

总原则：
- 整个站点是静态三语
- 浏览器语言优先
- 手动切换持久化
- 缺失翻译字段时，回退英语
- 尤其是文章 / 日志 / 文档内容，因为未来可能以英语为主更新，所以 zh-CN / pt 缺失时，必须自动显示英语版本，不允许空白

强约束：
1. 所有 UI 文本都进入 i18n JSON
2. 不允许组件中硬编码中文或英文正文
3. locale key 必须严格一致
4. `<html lang="">` 必须同步更新
5. 页面标题 `<title>` 最好也随语言更新

推荐内容国际化架构：
- UI chrome：
  - `src/i18n/locales/zh-CN.json`
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/pt.json`
- 频繁更新内容（日志/文档/研究）：
  - `content/en/...`
  - `content/zh-CN/...`
  - `content/pt/...`

内容回退规则：
- 先找当前语言同 slug 文件
- 找不到则自动回退到英语同 slug 文件
- 若英语也没有，再显示“content unavailable”

--------------------------------------------------
十二、内容与前端解耦（必须重点实现）
--------------------------------------------------

这是核心要求之一。

目标：
让 PM / 内容负责人可以尽量只通过修改 markdown 文件来更新网站内容，而不是每次改 React 组件。

必须实现内容系统：

A. 内容目录设计
建议类似：

content/
  en/
    logs/
    docs/
    research/
    meetings/
    weekly-reports/
  zh-CN/
    logs/
    docs/
    research/
    meetings/
    weekly-reports/
  pt/
    logs/
    docs/
    research/
    meetings/
    weekly-reports/

B. 每篇 markdown 使用 front matter
建议字段至少包括：
- id
- slug
- title
- type
- date
- owner
- ownerRole
- status
- summary
- relatedTeams
- relatedRepos
- sprint
- tags
- attentionTags
- version（文档类）
- reviewStatus（文档类）
- lastUpdated
- links
- evidence
- actionItems
- featured（可选）
- archived（可选）

C. 构建脚本
实现一个构建脚本，例如：
- `scripts/build-content.ts`
功能：
1. 扫描 content 目录
2. 解析 markdown front matter
3. 生成统一的内容索引
4. 检查重复 slug
5. 检查缺失必填字段
6. 生成 `src/generated/content-index.generated.json`
7. 生成 tag / team / type / year 等辅助索引
8. 让前端页面基于生成结果渲染列表和详情

D. 假期脚本
实现一个独立脚本，例如：
- `scripts/fetch-holidays.ts`
功能：
1. 拉取中国与葡萄牙假期
2. 生成静态 JSON
3. 写入 `src/generated/holidays/`
4. 失败时保留旧文件不覆盖

E. npm scripts
至少包含：
- `dev`
- `build`
- `build:content`
- `build:holidays`
- `check:content`
- `prebuild`（自动先跑内容构建）

注意：
- 内容更新应尽量不触碰 React 代码
- 前端只负责展示生成后的结构化数据
- 这是 portal 的关键可维护性要求

--------------------------------------------------
十三、Markdown 渲染与锚点分享（必须做好）
--------------------------------------------------

日志、研究、会议、周报详情页必须支持稳定的 sharable 链接。

技术要求：
- 使用 react-markdown
- 使用 remark-gfm
- 使用 rehype-slug
- 使用 rehype-autolink-headings

必须支持：
1. 文章级别 URL
   - `/logs/weekly-report-05`
2. 标题锚点 URL
   - `/logs/weekly-report-05#action-items`
3. 页面内固定 section URL
   - `/architecture#if2-dependencies`
   - `/#latest-updates`

额外要求：
- 给所有详情页 heading 提供可见但克制的 anchor icon
- 锚点滚动时要考虑 sticky header，避免标题被遮住
- 用 `scroll-margin-top` 处理
- 可以在 heading hover 时显示 copy-link 按钮
- 标签页切换或筛选后，如用户点击某篇文章，应有稳定 URL

--------------------------------------------------
十四、友链、跨组协作与标签系统
--------------------------------------------------

为了方便各友军队伍协作，portal 必须有友链与标签体系。

A. 友链 / Team Links
至少有一个专门板块或页面片段，展示：
- 各小组名称
- 职责简述
- 相关 repo / site 链接
- 当前状态（可选）
- 是否与 M2 有直接接口关系

B. 标签系统必须分两类
1. 分类标签
   - research
   - meeting
   - interface
   - test
   - demo
   - deliverable
   - milestone
2. 协作提醒 / 目标队伍标签
   - attention:V2
   - attention:M1
   - attention:S1
   - attention:S2
   - attention:V1
   - attention:M2
   - attention:backend
   - attention:hardware
   - attention:ai

C. 展示要求
- 文章卡片、详情页、更新流都要展示 tags
- attention 标签要更醒目，但仍克制
- `/logs` 页面应支持按 attention 标签筛选
- 可以提供“Related teams”跳转

D. 设计原则
- 不把标签做成花哨彩虹贴纸
- 用统一 chip 系统
- 分类标签和提醒标签视觉层级不同
- 允许加小 icon，但不要堆太多

--------------------------------------------------
十五、可读性增强（必须重视，但不能浮夸）
--------------------------------------------------

这是本轮的重要改进点。

目标：
- 吸取 proposal 页反馈
- 提升正文、日志、长文的阅读舒适度
- 保持正式工程页面风格
- 不做英雄字体乱飞

必须实现：
1. 更好的正文宽度与行高
2. 标题与 lead 的层级清楚
3. 长文详情页使用更强的可读性排版
4. 适量的：
   - icon
   - subtle highlight
   - pull-quote / emphasized sentence
   - muted text hierarchy
5. 少量“大字抓手”只用于 section 起始，不允许每屏都出现
6. 结构优先于装饰

可选增强：
- 阅读辅助 toggle：
  - normal
  - readable
  - bionic
- 默认 normal
- 只作用于 article content 区域
- 不作用于导航、表格、日历、结构图、按钮

若接入 bionic reading：
- 必须本地执行
- 不能依赖远程闭源 API
- 提供一键关闭
- DOM 结构不能被破坏
- 如果兼容性差，宁可退化为本地 `ReadableText` 组件，也不要让正文崩坏

--------------------------------------------------
十六、图标与轻交互要求
--------------------------------------------------

允许使用 icon，但必须克制。

建议可以有 icon 的位置：
- Quick links
- Doc categories
- Event types
- Tags / attention tags
- Timezone cards
- Repo cards
- Copy-link button
- External link button

交互只允许：
- section 淡入上浮
- 卡片 hover 轻微上移
- 边框、背景、阴影过渡
- tab / filter 切换轻微淡入
- sticky header 滚动后增强玻璃感
- 当前导航高亮

严禁：
- 自动轮播
- 连续脉冲
- 夸张缩放
- 粒子
- 复杂 SVG 路径动画
- 3D 翻转
- 首屏强动效

--------------------------------------------------
十七、组件建议
--------------------------------------------------

优先沿用或复刻我们系列页常见的组件思路：

- Header
- Footer
- SectionTitle
- LanguageSwitcher
- RevealOnScroll
- InfoCard
- RepoCard
- TeamCard
- StatusChip
- UpdateItem
- MarkdownArticle
- TagChip
- AttentionChip
- CalendarEventPanel
- TimezoneClockCard
- Timeline / MilestoneList
- FilterBar
- SearchInput（可选）

组件原则：
- 小而清楚
- 一个组件一个职责
- 命名直白
- 不做难懂抽象
- 允许适度样式重复，优先可维护性

--------------------------------------------------
十八、推荐项目结构
--------------------------------------------------

请尽量采用如下结构：

src/
  app/
    router.tsx
  components/
    Header.tsx
    Footer.tsx
    SectionTitle.tsx
    LanguageSwitcher.tsx
    RevealOnScroll.tsx
    StatusChip.tsx
    QuickLinkBar.tsx
    InfoCard.tsx
    RepoCard.tsx
    TeamCard.tsx
    UpdateItem.tsx
    TagChip.tsx
    AttentionChip.tsx
    MarkdownArticle.tsx
    FilterBar.tsx
    CalendarEventPanel.tsx
    TimezoneClockCard.tsx
  pages/
    HomePage.tsx
    ProgressPage.tsx
    LogsPage.tsx
    LogDetailPage.tsx
    DocsPage.tsx
    ArchitecturePage.tsx
    CalendarPage.tsx
  content/
    index.ts
    queries.ts
  i18n/
    index.ts
    locales/
      zh-CN.json
      en.json
      pt.json
  generated/
    content-index.generated.json
    holidays/
  hooks/
    useActiveSection.ts
    useDocumentTitle.ts
    useTimezoneClock.ts
  styles/
  utils/
    content.ts
    date.ts
    tags.ts
    links.ts
  App.tsx
  main.tsx
  index.css

scripts/
  build-content.ts
  fetch-holidays.ts
  check-content.ts

content/
  en/
  zh-CN/
  pt/

--------------------------------------------------
十九、README 必须写清楚
--------------------------------------------------

README 至少包括：

1. 项目简介
2. portal 的定位与边界
3. 页面结构
4. 本地开发方法
5. markdown 内容如何写
6. front matter 字段说明
7. 多语言策略
8. 缺失翻译如何回退英语
9. 假期数据如何更新
10. 为什么故意避免“浮夸英雄屏”和“重动画”
11. 如何部署到 VPS
12. 目录结构说明

--------------------------------------------------
二十、验收标准
--------------------------------------------------

只有同时满足以下条件，才算完成：

1. `npm install` 后可运行
2. `npm run dev` 正常
3. `npm run build` 正常
4. `build-content` 能根据 markdown 生成内容索引
5. `fetch-holidays` 能生成静态假期 JSON
6. 页面结构完整：
   - /
   - /progress
   - /logs
   - /logs/:slug
   - /docs
   - /architecture
   - /calendar
7. 首页是中枢总览，不是产品页
8. M2 边界清楚
9. 所有 UI 文本都进入 i18n
10. zh / pt 缺失内容时能正确显示英语
11. 日志/文档内容可以只改 markdown 而不改 React 组件
12. 文章支持 heading anchor 直接分享
13. 页面 section 支持 URL 直达
14. tags / attention tags 正常工作
15. 友链区存在且清楚
16. 日历页可翻月、可筛选、能显示中国/葡萄牙假期
17. 日历页有中国/葡萄牙实时时钟
18. 页面风格属于同一系列：
   - 浅色
   - 轻玻璃
   - 低动效
   - 高可读
19. 没有全屏 hero 大字霸屏
20. 没有浮夸动效
21. 代码适合初学者继续维护

--------------------------------------------------
二十一、最终提醒
--------------------------------------------------

这不是：
- 产品营销站
- 招募宣传站
- 个人作品集
- 炫技型前端实验页

它应该是一套：
- 正式
- 克制
- 清楚
- 可核查
- 可分享
- 可维护
- 对跨组协作友好的项目门户

如果你在某个地方犹豫：
- 要不要更炫？
- 要不要更复杂？
- 要不要多加一个库？
- 要不要做更酷的首页？

默认答案都应该是：不要。

请直接输出一个可运行的项目实现，而不是仅仅写说明。