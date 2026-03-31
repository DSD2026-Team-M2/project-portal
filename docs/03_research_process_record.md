# 项目调研、需求分析与规律总结留痕文档（模板 + 首版总结）

## 1. 为什么这类过程值得记录

对于 `project-portal` 来说，调研前人案例、分析课程需求、比较不同项目站点、总结哪些板块是必要共同点，这些并不是“临时思考过程”，而是**正式的设计依据**。

它至少有四个价值：

1. **证明设计不是拍脑袋决定的**。
2. **帮助老师理解你们为什么这样做 portal**。
3. **方便后续成员接手时知道结构从何而来**。
4. **为期末总结、复盘、经验沉淀提供证据链**。

因此，这类内容应被视为 `Research / Design Rationale`，而不是私下聊天记录。

---

## 2. 这类文档应该记什么

建议至少记录以下要素：

- 研究主题
- 研究动机
- 调研范围
- 查看了哪些样本
- 哪些样本可访问、哪些不可稳定访问
- 观察到的共同点
- 观察到的亮点
- 不适合照搬的做法
- 由此导出的设计决策
- 仍然未解决的问题

---

## 3. 本次调研的主题

> 主题：DSD 历届项目门户 / 展示站 / 团队仓库中，哪些“过程展示与协作留痕”内容是 project-portal 必须吸收的？

---

## 4. 本次调研范围

本次调研重点查看了以下类型内容：

- 团队 GitHub 仓库 README
- 团队项目主页 / GitHub Pages
- 日志、周报、会议纪要目录
- 甘特图、里程碑、时间线
- 角色分工与跨组链接
- 课程 wiki 中的官方入口与 team sites / agenda and milestones 索引

---

## 5. 样本分组与结论摘要

### 5.1 强过程记录型样本

#### dsd-db/main
亮点：
- 顶层直接拆出 `Weekly Report`、`Meetings`、`Knowledge`、`Program`、`Test`
- README 中直接嵌入 gantt
- 周报目录按周编号组织
- 会议目录按日期编号组织

启发：
- 过程内容必须分栏，不宜全部堆在一个 README 或首页中
- `logs` 与 `docs` 需要分层

#### Dream, Share, Discover
亮点：
- README 内有 dated updates
- 明确写出 role division、friend links
- 把内容分为 Readme / Daily / Calendar / Project

启发：
- portal 应区分 overview、process、calendar、project docs
- 必须把跨组关系显式展示出来

#### Water group
亮点：
- News 按日期列出
- 每条更新直接标注角色，如 P.M. / Programmer
- 更新条目直接关联 technical route、interface documentation、test programs

启发：
- update 记录不应只有日期，还应有 owner role 和 deliverable link

---

### 5.2 强汇报结构型样本

#### Brave Ones
亮点：
- About + Timeline + Notice + Gantt + Group Links + Team Roles
- 首页结构非常适合课程汇报场景

启发：
- portal 首页要按“汇报逻辑”组织，而不是产品营销逻辑
- timeline / roles / group links 是首页关键内容

#### SmartStride
亮点：
- 结构很克制，只保留 Latest News / Team Members / Project Progress

启发：
- 作为最小版本骨架很清楚
- 但如果没有 docs/logs 层，会显得太薄

---

### 5.3 强文档索引型样本

#### WNJXYK/JLU_DSD + 站点
亮点：
- README 中把不同版本文档、站点入口、API Console 入口暴露出来
- 站点顶部有 Github / Documents / API Console 快速入口

启发：
- portal 必须承担“文档索引器”职责
- 快速入口比大段介绍更关键

#### Rock House
亮点：
- 清楚写出自己是 Android 组
- 明确列出整个项目中其余小组及链接

启发：
- 必须先交代“我是谁，我做哪一块，其他组是谁”

---

### 5.4 强归档/博客型样本

#### PINKPIG
亮点：
- 有 archives、search、categories
- 分类中直接出现 Update / Demo / Gantt / Requirements / Website / Diagram / Test 等

启发：
- portal 后期应有 archive / category 思维
- 更新类内容适合做“可归档条目”，而非只停留在首页新闻栏

---

## 6. 本次调研提炼出的必要共同点

经过比对，这些内容最值得视为 portal 的“必要共同点”：

1. 明确写清团队身份与在大项目中的职责边界。
2. 必须有按日期排序的更新流。
3. 必须有里程碑或 gantt，而不只是写“在推进”。
4. 必须有角色 / 分工展示，而不是仅成员名单。
5. 必须有文档与交付中心。
6. 必须有会议或周报留痕。
7. 必须给跨组依赖留位置。
8. 必须让日志和交付物相互关联。

---

## 7. 本次调研发现的不建议照搬点

1. 只有好看首页、没有过程文档的站点，不适合你们的 portal 主结构。
2. 过于个人作品集化的表达，不适合作为正式项目中枢站主叙事。
3. 只有最新新闻、没有 docs/logs/architecture 分层，后期会迅速变乱。
4. 只放 screenshot 或 demo，不放时间、责任人和证据链接，会弱化课程汇报价值。

---

## 8. 从调研直接导出的设计决策

本次调研直接导出了以下 portal 设计决策：

1. `project-portal` 必须是 **中枢站**，而不是另一个产品主页。
2. 首页只放摘要，详情分到 `/progress`、`/logs`、`/docs`、`/architecture`。
3. `Latest Updates` 必须成为首页固定板块。
4. `Research` 必须成为正式内容类型，进入 logs/docs 体系。
5. 每条更新都尽量绑定 owner role + evidence link。
6. 必须展示 teams / repositories / dependencies 三类映射。
7. `M2 Contribution` 要写职责与边界，不能越权展示别人负责的主产品前端。

---

## 9. 适合的展示位置（这是重点）

### 9.1 不推荐的位置

- **不建议把整篇调研报告直接放首页正文**
  - 太长
  - 容易打断首页作为“中枢总览”的节奏

- **不建议只藏在私有笔记里**
  - 失去课程留痕价值
  - 后续成员难以接手

### 9.2 最推荐的位置

#### 方案 A：`/logs` 下设 Research 分类
最推荐。

原因：
- 这类内容本质上是项目推进过程的一部分
- 和 weekly report / meeting / update 同属“过程留痕”
- 适合按时间顺序记录“为什么这样设计 portal”

建议路径：
- `/logs/research`
- `/logs/research/prior-dsd-portal-review`

#### 方案 B：`/docs` 下设 Research / Design Rationale 分类
也推荐。

原因：
- 它又不仅是过程记录，也属于正式设计依据
- 对老师和后续接手者都很友好

建议路径：
- `/docs/research`
- `/docs/design-rationale`

### 9.3 最佳组合

我建议同时做两层露出：

#### 首页
只放一张小卡片或一条 latest research update：
- 标题：Portal Design Research Completed
- 摘要：We reviewed prior DSD team sites and extracted recurring requirements for logs, milestones, meetings, docs and team visibility.
- 按钮：View research note

#### 详情页
完整内容放在：
- `/logs/research/...` 或 `/docs/research/...`

这套做法可以兼顾：首页不过载，研究过程不丢失。

---

## 10. 推荐的数据结构

### 10.1 Research Summary Card
- `title`
- `date`
- `owner`
- `summary`
- `link`

### 10.2 Research Detail Entry
- `topic`
- `purpose`
- `scope`
- `samplesReviewed[]`
- `accessibleSamples[]`
- `unstableSamples[]`
- `findings[]`
- `patterns[]`
- `decisionsDerived[]`
- `openQuestions[]`
- `attachments[]`

---

## 11. 推荐首篇研究记录标题

你现在这次工作，完全可以作为首篇正式记录，标题可直接用：

### 中文版
《历届 DSD 项目门户与过程展示站调研：project-portal 所需板块、结构与留痕模式总结》

### 英文版
Prior DSD Portal Review: Required Sections, Structure and Traceability Patterns for project-portal

---

## 12. 可直接放到首页的研究摘要文案

### 中文
我们调研了多届 DSD 团队仓库、项目主页与课程 wiki，重点比较其日志、周报、甘特图、会议纪要、分工展示、里程碑与文档索引方式。基于这些样本，我们将 `project-portal` 定义为项目的过程展示与协作中枢，而不是另一个产品主页。

### 英文
We reviewed multiple prior DSD repositories, project sites and course wiki entries, focusing on how they handled logs, weekly reports, gantt charts, meeting records, role division, milestones and document indexing. Based on these patterns, we define `project-portal` as the project’s process-and-collaboration hub rather than another product homepage.

---

## 13. 最终建议

把“广泛调研、分析需求、总结规律”的过程正式纳入 portal 的内容体系，是值得做且应该做的。

最合适的落点是：

1. 首页放 research summary card；
2. `/logs` 中放时间序列的 research notes；
3. `/docs` 中保留一份整理后的 design rationale 文档；
4. 期末汇报时，把这类研究记录作为“为什么我们的 portal 长这样”的证据使用。
