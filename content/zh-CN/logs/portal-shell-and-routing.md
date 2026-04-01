---
id: log-portal-shell-and-routing
slug: portal-shell-and-routing
title: Portal 外壳与路由已完成
type: update
date: 2026-03-31
owner: M2 Developer
ownerRole: Programmer
status: in-progress
summary: portal 的路由外壳已经搭好，覆盖总览、进度、日志、文档、架构与日历页面。
relatedTeams:
  - M2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - milestone
attentionTags:
  - attention:M2
lastUpdated: 2026-03-31
links:
  - label: 架构页
    href: /architecture
evidence:
  - label: 进度页
    href: /progress
actionItems:
  - owner: M2
    task: 将生成的 markdown 内容接入所有列表页与详情页。
featured: true
---

## 本次变更

portal 现在已经有稳定的多页面路由外壳，每个核心信息支柱都有独立地址。

## 已落下的页面

- `/`
- `/progress`
- `/logs`
- `/logs/:slug`
- `/docs`
- `/docs/:slug`
- `/architecture`
- `/calendar`

## 这样做的意义

这让 portal 真正变成可分享、可协作的中枢站，而不是一张很长的单页。老师和队友可以直接跳到对应页面或记录。
