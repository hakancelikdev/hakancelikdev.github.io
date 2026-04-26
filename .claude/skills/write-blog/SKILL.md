---
name: write-blog
description: Writes a blog post about a topic the user has learned. Critiques the user's ideas, checks for duplicate posts, recommends the best narrative style for the audience, finds and downloads a relevant image, and produces both Turkish and English versions with proper frontmatter.
---

# Write Blog Post

The user has learned something new and wants to turn it into a blog post. They share their ideas and perspective; you evaluate the topic independently, critique their framing, and produce a polished post.

## Step 1 — Scan Existing Posts

Read all `.md` files under `src/data/tr/` (frontmatter only: `title`, `category`, `tags`, `excerpt`).

- Find any posts that cover the same or closely related topic.
- If a **very similar post already exists**, stop and inform the user:
  > "A post on this topic already exists: **[Title]** (`/slug`). Do you still want to write a new one, or would you prefer to update the existing post?"
  Wait for their answer before proceeding.
- If **related posts exist** (not duplicates), keep them as cross-link candidates.

## Step 2 — Critique the User's Ideas

Before writing anything, give the user honest, constructive feedback on what they've shared:

- **What's strong:** Which insight or framing is genuinely valuable and worth centering the post on?
- **What's missing:** Key concepts, context, or nuance that a reader would need to fully understand the topic.
- **What could be reframed:** Parts of their explanation that are unclear, technically imprecise, or that could be expressed more powerfully.
- **Suggestions:** Concrete ideas for angles, examples, analogies, or structure that would make the post more compelling.

Keep this section concise — 3 to 5 bullet points. Don't rewrite the post here; just align on the approach before writing.

## Step 3 — Choose the Best Narrative Style

Pick the narrative style that best fits the topic and its likely audience. Use only one dominant style per post.

| Style | Best for | Signal |
|---|---|---|
| **"Aha moment" first-person** | Conceptual insights, mental model shifts | User says "I realized…", "I didn't know…" |
| **Problem → Solution** | Tools, frameworks, techniques | User describes a pain point that was solved |
| **How it actually works** | Internals, under-the-hood mechanics | Topic is widely used but poorly understood |
| **Step-by-step practical** | Tutorials, setup guides, workflows | Topic requires a sequence of actions |
| **Comparison / contrast** | Choosing between options | Topic involves trade-offs |

State which style you're using and why, then write in that style consistently.

## Step 4 — Find and Download a Relevant Image

1. First check `src/assets/images/blog/` — if an existing image fits the topic, reuse it.
2. If not, search Pexels for a high-quality, free-to-use image that is **visually specific** to the topic:
   - Fetch real photo IDs from a Pexels search page
   - Download 2–3 candidates and **view each one** before deciding
   - Reject: generic office scenes, stock-photo hands on keyboards, abstract fire/explosions
   - Accept: imagery that a reader would immediately associate with the topic
3. Save to `src/assets/images/blog/[topic-keyword].jpg` (short English filename, lowercase, hyphens).

## Step 5 — Determine Category, Slug, and Tags

**Category** — check existing directories under `src/data/tr/`. Reuse an existing category if it fits; create a new one only if genuinely necessary.

**Turkish slug** — lowercase, no Turkish characters, hyphens only. Descriptive but not too long.  
Example: `python-decorator-nedir`

**English slug** — natural English phrasing, not a translation.  
Example: `how-python-decorators-actually-work`

**Tags** — 3 to 5, lowercase, hyphenated. Turkish tags for the TR post, English tags for the EN post.

## Step 6 — Write the Turkish Post

File: `src/data/tr/[category]/[tr-slug].md`

```yaml
---
publishDate: [today's date]T00:00:00Z
author: Hakan Çelik
title: "[Turkish title — clear, specific, not clickbait]"
excerpt: "[150–200 characters. Conveys the core insight. Makes someone want to read it.]"
category: [Category]
image: ~/assets/images/blog/[image-file].jpg
tags:
  - [tag-1]
  - [tag-2]
  - [tag-3]
---
```

Writing rules:
- Open with the insight or problem — don't warm up slowly
- Use concrete examples, code blocks, tables, or ASCII diagrams wherever they help
- Cross-link to related posts naturally: `[post title](/slug)` — only where it flows organically, never forced
- Write with confidence — no hedging phrases like "this analogy isn't perfect" or "just to note that…"
- Close with a sentence that reframes how the reader sees the topic

## Step 7 — Write the English Post

File: `src/data/en/[category]/[en-slug].md`

Not a translation — a version written for an English-speaking reader. Titles, excerpts, slugs, and tags are in English. The narrative may differ slightly if the framing lands better differently in English.

## Step 8 — Build and Verify

```bash
npm run build
```

Confirm no errors. Report the final URLs of both posts.

---

## Usage

The user shares what they've learned, then invokes the skill:

> "I learned about Python decorators today — turns out they're just higher-order functions, the @ syntax is sugar for passing a function as an argument... /write-blog"

You then work through Steps 1–8 in order: check for duplicates, critique the ideas, pick a style, find an image, write both posts, build.
