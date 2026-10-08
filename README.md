# karvy's writings

An Eleventy blog that turns Markdown files into the styled pages used by `blogs.karvys.dev`.

## Write a post

Create one directory per post, with its content in `index.md`:

```text
src/posts/my-blog-name/index.md
```

Add a unique `slug`. It becomes the public URL:

````md
---
title: My new note
slug: my-blog-name
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

This example is generated at:

```text
https://blogs.karvys.dev/my-blog-name/
```

Use lowercase URL-safe slugs. Hyphens are recommended for public posts.

The two links under “More...” prioritize recent posts sharing any category with the current note, then fall back to the two most recent posts globally.

## Syntax highlighting

Add the language name after the opening fence. Prism highlighting is available for common languages including:

| Language | Fence |
| --- | --- |
| Python | `python` or `py` |
| C++ | `cpp` |
| C | `c` |
| Java | `java` |
| Kotlin | `kotlin` |
| PHP | `php` |
| Go | `go` |
| HTML | `html` or `markup` |
| CSS | `css` |
| JavaScript | `js` or `javascript` |
| TypeScript | `ts` or `typescript` |
| Shell | `sh` or `bash` |

Every fenced code block displays its language and includes a button that copies the complete block to the clipboard.

For example:

````md
```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```
````

## LaTeX

KaTeX renders mathematics during the build. Use single dollar signs for inline expressions:

```md
Einstein's equation is $E = mc^2$.
```

Use double dollar signs for a centered display equation:

```md
$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

Escape literal currency delimiters as `\$` when needed.

## Images

Store images under a matching directory in `src/images/`:

```text
src/images/my-blog-name/diagram.webp
```

Reference them from Markdown:

```md
![Diagram description](/images/my-blog-name/diagram.webp)
```

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

## Cloudflare Pages

Connect the repository in Cloudflare Pages with these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Eleventy |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Root directory | Leave blank |

After the first deployment, add `blogs.karvys.dev` under the Pages project's **Custom domains** settings.
