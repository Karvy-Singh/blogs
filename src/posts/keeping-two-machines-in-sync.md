---
title: Keeping two machines boringly in sync
description: A small, predictable approach to synchronizing development environments.
date: 2026-09-28
categories:
  - workflow
  - productivity
---

Machine setup should be reproducible without becoming a project of its own. Keep the shared configuration small, document the exceptions, and automate only the steps that stay stable.

## Start with the files that matter

Track shell configuration, editor settings, and a short package list. Leave caches, machine-specific secrets, and generated state where they belong.

> **Note.** Synchronization is useful when it removes setup work, not when it hides where configuration comes from.
