---
id: log-2026-05-18-dr-yin-knee-function-assessment-consultation
slug: 2026-05-18-dr-yin-knee-function-assessment-consultation
title: M2 队长与尹医生召开膝关节功能评估系统线上咨询会议
type: meeting
date: "2026-05-18T20:00:00+08:00"
owner: Lee
ownerRole: PM
status: completed
summary: 5 月 18 日，M2 队长 Lee 与课程顾问尹医生召开线上会议，围绕医生端网页系统、患者数据采集、膝关节功能评估标准动作、医患绑定逻辑及后续功能迭代进行了集中讨论。
relatedTeams:
  - M2
  - M1
  - S1
  - S2
  - V1
  - V2
relatedRepos:
  - project-portal
tags:
  - meeting
  - consultation
  - requirements
  - doctor-side
  - knee-assessment
attentionTags:
  - attention:M2
  - attention:M1
  - attention:S1
  - attention:S2
  - attention:V1
  - attention:V2
lastUpdated: 2026-05-19
links:
  - label: 详细会议纪要
    href: /docs/meeting-minutes-2026-05-18-dr-yin-knee-function-assessment-consultation
evidence:
  - label: OARSI 下肢功能表现型测试
    href: https://oarsi.org/research-oarsi-success/physical-performance-measures
  - label: Timed Up and Go - RehabMeasures Database
    href: https://www.sralab.org/rehabilitation-measures/timed-and-go
actionItems: []
featured: false
archived: false
---

2026 年 5 月 18 日，M2 队长 Lee 与课程顾问尹医生召开线上会议，围绕当前膝关节功能评估系统的医生端网页、管理员审核、患者采集记录展示、康复建议下发等功能进行了演示与讨论。会议中，尹医生指出，系统当前不宜过度强调界面理想化呈现，而应优先解决“采集动作是否标准、曲线是否可解释、评估结果是否具有临床意义”等核心问题。

## 从曲线展示转向功能评估

会议明确，后续系统应从“单纯展示角度曲线”转向“基于标准动作的功能评估”。尹医生建议优先设计三类贴近日常生活的标准动作：坐下/起立或蹲起、平路向前行走、上下楼，并建立正常人群的标准基线曲线。

这一方向也与外部膝关节和下肢功能评估资料基本一致。OARSI 推荐的表现型测试包括 30 秒坐站、40 米快速步行、楼梯测试、Timed Up and Go、6 分钟步行等；Timed Up and Go 的标准流程也包含从椅子起身、步行、转身、返回并坐下。

## 标准曲线与可解释差异

会议进一步确认，患者曲线不应被孤立查看，而应与标准曲线或基线曲线进行对比。尹医生建议先组织健康被试者完成标准动作采集，对曲线进行平均或归一化处理，形成参考基线。

后续医生端展示时，应将患者曲线与标准曲线同图呈现，并从动作幅度、速度、周期宽度和不规则程度等角度辅助判断患者可能存在的活动度不足、肌肉力量不足、控制能力较差或综合功能受限等问题。

## 流程边界与 AI 定位

会议还讨论了医生与患者的绑定逻辑、患者端使用方式及 AI 建议模块边界。尹医生建议采用简单的一对多结构：患者通过医生提供的链接或二维码注册，注册后单向绑定至对应医生；医生只能查看自己绑定的患者，患者不应脱离医生独立注册。

在采集设备方面，会议倾向于使用医生端固定平板或专用设备，并提前完成传感器适配，而不是依赖患者个人手机。这样可以减少蓝牙适配不稳定问题，也更有利于现场指导和动作标准化。

对于 AI 建议模块，会议认为现阶段数据量和标准化程度不足，AI 不宜过早介入医学判断。当前优先级应放在标准动作、标准基线曲线、可解释对比、医生备注和人工选择康复动作上。若基础功能完善，后续再进一步探索动作捕捉、患者训练视频及医生助理型 AI 等扩展方向。

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU
