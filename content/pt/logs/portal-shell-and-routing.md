---
id: log-portal-shell-and-routing
slug: portal-shell-and-routing
title: Estrutura e routing do portal implementados
type: update
date: 2026-03-31
owner: M2 Developer
ownerRole: Programmer
status: in-progress
summary: A estrutura com routing do portal já cobre visão geral, progresso, registos, documentos, arquitetura e calendário.
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
  - label: Página de arquitetura
    href: /architecture
evidence:
  - label: Página de progresso
    href: /progress
actionItems:
  - owner: M2
    task: Ligar o conteúdo markdown gerado a todas as listas e páginas de detalhe.
featured: true
---

## O que mudou

O portal agora possui uma estrutura de routing estável, dando a cada pilar principal do projeto a sua própria página.

## Conjunto de páginas

- `/`
- `/progress`
- `/logs`
- `/logs/:slug`
- `/docs`
- `/docs/:slug`
- `/architecture`
- `/calendar`

## Impacto

Isto transforma o portal num centro de colaboração partilhável, em vez de uma única página longa. Professores e colegas podem abrir diretamente a página ou registo relevante.
