#!/usr/bin/env node
// Usage: npm run new "Post Title"
const fs = require('fs');
const path = require('path');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new "Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

if (!slug) {
  console.error('Could not derive a slug from that title. Try something with letters/numbers.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const postDir = path.join('posts', slug);
const imagesDir = path.join(postDir, 'images');
const mdFile = path.join(postDir, 'index.md');

if (fs.existsSync(postDir)) {
  console.error(`Post directory already exists: ${postDir}`);
  process.exit(1);
}

fs.mkdirSync(imagesDir, { recursive: true });

const body = `---
title: "${title.replace(/"/g, '\\"')}"
deck: ""
date: ${today}
tags: []
draft: true
# pull: "Optional pull-quote shown on the index card when this is the newest post."
---

Write the post body here. Standard markdown works — \`##\` headings become the
TOC, \`**bold**\`, \`*italic*\`, \`code\`, \`[links](https://example.com)\`,
numbered and bulleted lists, fenced code blocks.

## First section

Custom blocks:

::: pull
"A pull quote for in-article emphasis."
:::

::: callout Aside
A small sidebar note with a colored border.
:::

![alt text](images/example.png "Caption shown under the figure.")
`;

fs.writeFileSync(mdFile, body);
console.log(`Created ${mdFile}`);
console.log(`        ${imagesDir}/`);
console.log('Edit the frontmatter, write the post, then run: npm run dev');
