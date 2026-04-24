const markdownIt = require('markdown-it');
const mdContainer = require('markdown-it-container');
const mdImageFigures = require('markdown-it-image-figures');

module.exports = function (eleventyConfig) {
  // ─── Markdown library ──────────────────────────────────────
  const md = markdownIt({
    html: true,
    typographer: true,
    linkify: false,
  });

  // Sequential s1, s2, s3… ids on <h2> so the TOC anchors match
  // the reference design (href="#s1" style).
  md.core.ruler.push('h2-numbering', function (state) {
    let counter = 0;
    for (const token of state.tokens) {
      if (token.type === 'heading_open' && token.tag === 'h2') {
        counter++;
        token.attrSet('id', `s${counter}`);
      }
    }
  });

  // ::: pull  →  <blockquote class="pull">
  md.use(mdContainer, 'pull', {
    render(tokens, idx) {
      return tokens[idx].nesting === 1
        ? '<blockquote class="pull">\n'
        : '</blockquote>\n';
    },
  });

  // ::: callout Label   →  <div class="callout"><div class="callout__lbl">Label</div>
  md.use(mdContainer, 'callout', {
    validate(params) {
      return /^callout(\s+.*)?$/.test(params.trim());
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const info = tokens[idx].info.trim();
        const m = /^callout\s+(.+)$/.exec(info);
        const label = m ? md.utils.escapeHtml(m[1]) : 'Note';
        return `<div class="callout">\n<div class="callout__lbl">${label}</div>\n`;
      }
      return '</div>\n';
    },
  });

  // ![alt](path "caption")  →  <figure><img><figcaption>caption</figcaption>
  md.use(mdImageFigures, { figcaption: 'title' });

  eleventyConfig.setLibrary('md', md);

  // ─── Passthrough copies ────────────────────────────────────
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('posts/**/images/**');
  eleventyConfig.addPassthroughCopy('CNAME');

  // ─── Collections ───────────────────────────────────────────
  // Oldest-first: collection index + 1 = post number.
  eleventyConfig.addCollection('posts', function (api) {
    const includeDrafts = process.env.ELEVENTY_ENV === 'dev';
    return api
      .getFilteredByGlob('posts/**/*.md')
      .filter((p) => includeDrafts || !p.data.draft)
      .sort((a, b) => a.date - b.date);
  });

  // ─── Filters ───────────────────────────────────────────────

  eleventyConfig.addFilter('formatDate', function (d) {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    // Use UTC so YAML date-only values (e.g., 2026-04-22) don't drift
    // back a day when formatted in the build host's local timezone.
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  });

  eleventyConfig.addFilter('wordCount', function (html) {
    const text = (html || '').replace(/<[^>]+>/g, ' ');
    return text.split(/\s+/).filter(Boolean).length;
  });

  eleventyConfig.addFilter('readTime', function (html) {
    const text = (html || '').replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  });

  // Pull headings from rendered HTML so the TOC matches the h2 ids.
  eleventyConfig.addFilter('extractToc', function (html) {
    const toc = [];
    const re = /<h2\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(html || '')) !== null) {
      toc.push({
        id: m[1],
        title: m[2].replace(/<[^>]+>/g, '').trim(),
      });
    }
    return toc;
  });

  eleventyConfig.addFilter('postNumber', function (url, posts) {
    const idx = (posts || []).findIndex((p) => p.url === url);
    return idx >= 0 ? idx + 1 : '';
  });

  eleventyConfig.addFilter('olderPost', function (url, posts) {
    const idx = (posts || []).findIndex((p) => p.url === url);
    return idx > 0 ? posts[idx - 1] : null;
  });

  eleventyConfig.addFilter('newerPost', function (url, posts) {
    const idx = (posts || []).findIndex((p) => p.url === url);
    return idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
  });

  return {
    dir: {
      input: '.',
      output: 'site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
