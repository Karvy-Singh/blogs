# karvy's writings

An Eleventy blog that turns Markdown files into the styled pages used by `blogs.karvys.dev`.

## Write a post

Create a Markdown file in `src/posts/`:

````md
---
title: My new note
description: A short summary used on indexes and in RSS.
date: 2026-10-07
categories:
  - workflow
  - git
---

Write the article here.

## A section

> **Note.** Blockquotes are rendered as note boxes.

```sh
echo "Fenced blocks become code areas"
```
````

The two links under “More...” prioritize recent posts sharing any category with the current note, then fall back to the two most recent posts globally.

## Develop

```sh
npm install
npm start
```

Open `http://localhost:8080`.

## Build

```sh
npm run build
```

The generated site is written to `_site/`.
