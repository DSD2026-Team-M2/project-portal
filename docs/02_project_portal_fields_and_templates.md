# project-portal 字段清单与推荐文案模板

## 1. 文档用途

本文件定义 `project-portal` 各板块需要的数据字段、后台/前台展示最小单位，以及适合直接使用的推荐文案模板。

目标：
- 帮助前端搭页面
- 帮助 PM / 记录负责人填内容
- 保证多篇日志、多类文档的写法统一

---

## 2. 全站通用字段

建议所有内容实体都尽量包含以下基础字段：

- `id`
- `title`
- `type`
- `date`
- `owner`
- `ownerRole`
- `status`
- `summary`
- `links`
- `relatedTeams`
- `relatedRepos`
- `sprint`
- `tags`

如果是正式文档，再加：
- `version`
- `reviewStatus`

如果是日志，再加：
- `actionItems`
- `evidence`

---

## 3. 首页字段清单

### 3.1 Top Status Bar

#### 字段
- `projectName`
- `courseName`
- `term`
- `currentSprint`
- `lastUpdated`
- `quickLinks[]`

#### 推荐文案模板
**项目名**：
Limb Motion Recognition and Assistant

**副标题**：
DSD 2025–2026 · Project Portal

**当前阶段**：
Current Sprint: Sprint {{number}}

**最后更新时间**：
Last Updated: {{date}}

---

### 3.2 项目定位区

#### 字段
- `overviewTitle`
- `overviewP1`
- `overviewP2`
- `portalRole`
- `m2BoundaryNote`
- `summaryCards[]`

#### 推荐文案模板
**总项目一句话**：
This project aims to build a limb motion recognition and assistance system through collaboration across sensing, backend, data processing, AI and frontend teams.

**portal 一句话**：
This portal is the project’s hub for progress tracking, documentation navigation, meeting records and cross-team collaboration visibility.

**M2 边界一句话**：
M2 maintains this portal and focuses on clinical dashboard related web work, while the main product web frontend is maintained in a separate repository.

---

### 3.3 Current Progress Snapshot

#### 字段
- `currentSprint`
- `sprintGoal`
- `completed`
- `inProgress`
- `nextMilestone`
- `risks`

#### 推荐文案模板
**Sprint Goal**：
Our current goal is to {{goal}}.

**Completed**：
Completed: {{item1}}; {{item2}}; {{item3}}

**In Progress**：
In Progress: {{item1}}; {{item2}}

**Next Milestone**：
Next Milestone: {{milestone}} on {{date}}

**Risk**：
Current Risk: {{risk}}.

---

## 4. 系统结构图字段

### 4.1 Team Node 字段
- `teamId`
- `teamName`
- `layer`
- `responsibility`
- `inputs`
- `outputs`
- `repoLinks[]`
- `status`

### 4.2 Repo Card 字段
- `repoName`
- `repoRole`
- `maintainer`
- `status`
- `link`
- `notes`

### 4.3 推荐文案模板
**M2 节点说明**：
M2 focuses on the clinical web dashboard and related portal maintenance. It consumes processed data and interface outputs from upstream teams and turns them into readable, trackable web views for professional users.

**project-main-web 仓库说明**：
Main frontend repository for the project’s core data visualisation web application. Maintained by another responsible group.

**project-portal 仓库说明**：
Portal repository for project overview, progress, documentation indexing and collaboration records. Maintained by M2.

**m2-recruitment-site 仓库说明**：
Archived recruitment site for M2 team formation. Completed and kept as a historical deliverable.

---

## 5. Latest Updates 模块字段

### 5.1 Update Item 最小字段
- `id`
- `date`
- `type`
- `title`
- `summary`
- `owner`
- `ownerRole`
- `relatedTeams[]`
- `relatedRepos[]`
- `evidenceLinks[]`
- `detailLink`

### 5.2 类型枚举建议
- `update`
- `meeting`
- `deliverable`
- `test`
- `interface`
- `demo`
- `research`
- `decision`

### 5.3 推荐写法模板
**标题模板**：
{{date}} · {{type}} · {{short title}}

**摘要模板**：
{{ownerRole}} completed {{what}} and linked the related {{evidence type}} for verification.

**例子**：
2026-03-28 · Research · Prior DSD portal patterns reviewed
M2 PM completed a comparative review of prior DSD team sites and extracted recurring requirements for logs, milestones, meetings, deliverables and cross-team visibility.

---

## 6. Weekly Report 字段与模板

### 6.1 字段
- `weekNo`
- `date`
- `sprint`
- `goal`
- `completed[]`
- `technicalLearning[]`
- `coordination[]`
- `blockers[]`
- `nextWeekPlan[]`
- `attachments[]`

### 6.2 推荐模板

#### 标题
Week {{weekNo}} Report · {{date}}

#### 小节模板
**Goal**
This week we focused on {{goal}}.

**Completed**
- {{completed 1}}
- {{completed 2}}
- {{completed 3}}

**Technical Learning / Decisions**
- {{learning or decision 1}}
- {{learning or decision 2}}

**Coordination**
- {{cross-team or internal coordination item}}

**Blockers / Risks**
- {{blocker}}

**Plan for Next Week**
- {{next action 1}}
- {{next action 2}}

---

## 7. Meeting Minutes 字段与模板

### 7.1 字段
- `meetingType`
- `date`
- `platform`
- `host`
- `participants[]`
- `agenda[]`
- `discussionSummary`
- `decisions[]`
- `actionItems[]`
- `attachments[]`

### 7.2 推荐模板

#### 标题
{{meetingType}} Meeting · {{date}}

#### 模板正文
**Meeting Information**
- Type: {{meetingType}}
- Date: {{date}}
- Platform: {{platform}}
- Host: {{host}}
- Participants: {{participants}}

**Agenda**
- {{agenda1}}
- {{agenda2}}

**Discussion Summary**
{{summary paragraph}}

**Decisions**
- {{decision1}}
- {{decision2}}

**Action Items**
- {{owner}}: {{task}} · Due {{date}}
- {{owner}}: {{task}} · Due {{date}}

---

## 8. Research Note（调研记录）字段与模板

> 这是你特别提到需要“留痕”的那类内容，建议作为正式内容类型存在。

### 8.1 字段
- `researchTopic`
- `date`
- `owner`
- `scope`
- `sourcesReviewed[]`
- `questions[]`
- `findings[]`
- `patterns[]`
- `decisionsDerived[]`
- `openQuestions[]`
- `recommendedPlacement`

### 8.2 推荐模板

#### 标题
Research Note · {{topic}}

#### 模板正文
**Purpose**
This research was conducted to clarify {{topic}} for the portal design and project coordination needs.

**Scope**
We reviewed {{source count}} prior DSD team sites / repositories / documentation entries.

**Key Questions**
- {{question1}}
- {{question2}}

**Findings**
- {{finding1}}
- {{finding2}}
- {{finding3}}

**Recurring Patterns**
- {{pattern1}}
- {{pattern2}}

**Design Decisions Derived**
- {{decision1}}
- {{decision2}}

**Open Questions**
- {{open question}}

---

## 9. Deliverable 文档卡片字段与模板

### 9.1 字段
- `docTitle`
- `docType`
- `version`
- `owner`
- `lastUpdated`
- `reviewStatus`
- `abstract`
- `link`

### 9.2 文档类型建议
- `RA`
- `SDS`
- `Interface`
- `Test`
- `Slide`
- `Demo`
- `Research`
- `Meeting`
- `WeeklyReport`

### 9.3 推荐模板
**标题**：
{{docType}} · {{docTitle}}

**摘要**：
Version {{version}} maintained by {{owner}}. Last updated on {{date}}.

**状态标签**：
Draft / In Review / Final / Archived

---

## 10. Team Card 字段与模板

### 10.1 字段
- `teamName`
- `layer`
- `responsibility`
- `primaryOutputs`
- `dependencies`
- `repoLinks[]`
- `status`

### 10.2 推荐模板
**Team Name**
{{teamName}}

**Responsibility**
{{responsibility}}

**Primary Outputs**
{{outputs}}

**Dependencies**
{{dependencies}}

---

## 11. Repo Card 字段与模板

### 11.1 字段
- `repoName`
- `maintainedBy`
- `role`
- `status`
- `summary`
- `link`

### 11.2 推荐模板
**Repo Name**
{{repoName}}

**Maintained By**
{{team / members}}

**Role**
{{what this repo is for}}

**Status**
{{active / archived / complete / in progress}}

**Summary**
{{one paragraph}}

---

## 12. 风险登记字段与模板

### 12.1 字段
- `riskId`
- `title`
- `description`
- `severity`
- `owner`
- `status`
- `mitigation`
- `lastUpdated`

### 12.2 推荐模板
**Risk**
{{title}}

**Description**
{{description}}

**Severity**
High / Medium / Low

**Mitigation**
{{mitigation plan}}

---

## 13. 首页推荐短文案（可直接改）

### 13.1 Portal 定位
This portal is designed as the central place for project overview, progress tracking, documentation access and collaboration records.

### 13.2 当前阶段
The project is currently in {{phase}}, with the team focusing on {{goal}} and preparing for {{next milestone}}.

### 13.3 M2 边界
M2 is responsible for portal maintenance and clinical dashboard related web work. The main product web frontend is maintained separately.

### 13.4 文档中心提示
All major deliverables, logs, reports and meeting records are indexed here for quick access.

---

## 14. 使用建议

1. 首页只放摘要卡片，不放长篇正文。
2. 所有 update / meeting / weekly / research 统一用模板写，便于后续列表化。
3. Research 类型不要藏起来，它本身就是有价值的项目资产。
4. 文档与日志都要带 owner、date、status，方便回溯。
5. M2 板块要写“职责与边界”，不要写成“总项目全由我们负责”。
