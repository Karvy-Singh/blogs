---
title: Make the boring parts disappear
slug: sample_blog_str
description: A small pattern for turning repetitive developer work into a quiet, dependable workflow.
date: 2026-10-06
categories:
  - workflow
  - git
  - productivity
---

The nicest tools are often the ones you stop noticing. They remove a small irritation, remember a decision you already made, and leave you with the part of the work that actually needs judgment.

That is the standard I like for development tooling: automate the obvious cases, preserve context for the ambiguous ones, and keep the interface quiet enough that the tool never becomes the project.

## Start with the repeatable part

Before adding a large system, write down the part you repeat exactly. The useful boundary is usually smaller than it first appears. Once that boundary is clear, the automation becomes easier to trust.

> **Note.** Good automation does not eliminate decisions. It removes decisions that have already been made.

## A tiny example

A short command can capture the mechanical part of a workflow while leaving the risky step visible:

```sh
# do the predictable work first
git fetch origin
git rebase origin/main

# inspect what still needs a human
git status --short
```

Nothing here is sophisticated. That is the point. A small, legible tool is easier to understand, easier to change, and easier to discard when it stops being useful.

## A tiny equation

Inline LaTeX works inside a sentence, such as $E = mc^2$.

Display equations are centered on their own line:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Images at any shape

Images retain their natural proportions and stay centered within the article.

<figure>
  <img src="/images/sample-square.svg" alt="Square abstract terminal illustration" loading="lazy" decoding="async">
  <figcaption>Square image, 1:1</figcaption>
</figure>

<figure>
  <img src="/images/sample-portrait.svg" alt="Portrait abstract diagram illustration" loading="lazy" decoding="async">
  <figcaption>Vertical image, 3:4</figcaption>
</figure>

<figure>
  <img src="/images/sample-landscape.svg" alt="Landscape abstract code graph illustration" loading="lazy" decoding="async">
  <figcaption>Horizontal image, 16:9</figcaption>
</figure>

## Keep the page quieter than the code

Technical writing benefits from contrast, but not from constant decoration. The body text should feel almost book-like; code, notes, and links should be the moments where the visual system becomes more explicit.

> The page should make it obvious where to look next without constantly asking for attention.

## Prefer a few strong conventions

This template uses a narrow reading measure, restrained metadata, clean typography, and one strong visual rail. Everything else is deliberately ordinary: plain links, plain headings, plain paragraphs, and code that looks like code.

- Use the sidebar as identity, not navigation.
- Keep article width around 68–72 characters.
- Use Overpass for clear, readable article copy.
- Let headings create rhythm instead of boxes and cards.
