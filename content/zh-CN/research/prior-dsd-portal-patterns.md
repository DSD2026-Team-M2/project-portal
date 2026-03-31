---
id: research-prior-dsd-portal-patterns
slug: prior-dsd-portal-patterns
title: 过往 DSD portal 模式调研
type: research
date: 2026-03-28
owner: M2 PM
ownerRole: PM
status: completed
summary: 对过往课程项目网页进行比较研究，总结 portal 在日志、里程碑、交付物与边界说明上的共性需求。
relatedTeams:
  - M2
relatedRepos:
  - project-portal
sprint: Sprint 5
tags:
  - research
  - deliverable
attentionTags:
  - attention:M2
lastUpdated: 2026-03-28
links:
  - label: Portal IA
    href: /docs/requirement-analysis-v1
evidence:
  - label: IA 设计记录
    href: /docs/system-design-outline-v1
actionItems:
  - owner: M2
    task: 将重复出现的 portal 模式沉淀为可复用的内容与布局规则。
featured: true
---

## 研究目的

回看过往 DSD 项目站点，提炼哪些结构最能支撑老师汇报、跨组协作与过程留痕。

## 核心发现

- 最有效的 portal 往往不是最花哨的页面，而是最容易回答关键问题的页面。
- 日志、周报、会议和正式文档需要被统一纳入信息架构，而不是分散在仓库深处。
- 仓库与职责边界越清楚，越不容易在汇报时“越权叙事”。

## 推导出的设计决策

- 首页必须是中枢总览，而不是产品页。
- `project-main-web`、`project-portal`、`m2-recruitment-site` 需要明确区分。
- 研究记录要作为正式内容类型进入 portal。
- 内容尽量从 markdown 生成，降低后续维护成本。
