const pluginSEO = require('eleventy-plugin-seo');
const { prefixMarkdownLinks } = require('./lib/prefix-markdown-links');
const markdownIt = require('markdown-it');
const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');
const seo = require('./src/_data/seo');

module.exports = function(eleventyConfig) {
  // Exclude content MD files from being processed as Eleventy pages
  eleventyConfig.ignores.add("src/content/**");

  eleventyConfig.addPlugin(pluginSEO, seo);

  function validateBlogPost(post) {
    const missing = [];
    if (!post?.data?.description) missing.push('description');
    if (!post?.data?.image) missing.push('image');

    if (missing.length > 0) {
      throw new Error(
        `Blog post ${post.inputPath} is missing required front matter: ${missing.join(', ')}`
      );
    }
  }

  // Filtro Nunjucks per formattare le date (compatibile con il template blog)
  eleventyConfig.addNunjucksFilter('date', function(date, format = 'yyyy-MM-dd') {
    if (!date) return '';
    const d = new Date(date);
    // Formattazione semplice: yyyy-MM-dd o dd MMM yyyy
    if (format === 'yyyy-MM-dd') {
      return d.toISOString().slice(0, 10);
    }
    if (format === 'dd MMM yyyy') {
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return d.toLocaleDateString();
  });
  // Reconstruct full path for blog post images (frontmatter stores only filename)
  eleventyConfig.addFilter('blogImage', function(filename) {
    if (!filename) return '';
    return `/assets/images/blog/${filename}`;
  });

  // Filter to check if a string starts with a prefix (used in sitemap)
  eleventyConfig.addFilter('startsWith', function(str, prefix) {
    if (!str || !prefix) return false;
    return str.startsWith(prefix);
  });

  // Extract the YouTube video id from any common YouTube URL form
  // (watch?v=, youtu.be/, embed/). Returns '' if not a YouTube URL.
  eleventyConfig.addFilter('youtubeId', function(url) {
    if (!url) return '';
    const match = String(url).match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : '';
  });
  // Collezione blog: tutti i markdown in src/blog/
  eleventyConfig.addCollection('blog', function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob('src/blog/*.md');
    posts.forEach(validateBlogPost);
    return posts;
  });
  // Markdown instance
  const md = prefixMarkdownLinks(markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }));

  // Filter to read and render biography Markdown files
  eleventyConfig.addFilter('getBio', function(teacherId) {
    try {
      const bioPath = path.join(__dirname, 'src/_data/bios', `${teacherId}.md`);
      const content = fs.readFileSync(bioPath, 'utf-8');
      return md.render(content);
    } catch (error) {
      return '<p>Biography not available.</p>';
    }
  });
  
  // Filter to convert markdown to HTML
  eleventyConfig.addFilter('markdown', function(content) {
    if (!content) return '';
    return md.render(content);
  });

  // Read a content MD file and return { html, data }
  // filename is relative to src/content/ (e.g. 'home/welcome.md')
  eleventyConfig.addFilter('pageContent', function(filename) {
    try {
      const contentPath = path.join(__dirname, 'src/content', filename);
      const raw = fs.readFileSync(contentPath, 'utf-8');
      const parsed = matter(raw);
      return { html: md.render(parsed.content), data: parsed.data };
    } catch (error) {
      return { html: '', data: {} };
    }
  });

  // Read all MD files in a content directory and return sorted array of { filename, html, data }
  // dir is relative to src/content/ (e.g. 'home/cards')
  eleventyConfig.addFilter('pageContentDir', function(dir) {
    try {
      const contentDir = path.join(__dirname, 'src/content', dir);
      const files = fs.readdirSync(contentDir)
        .filter(f => f.endsWith('.md'))
        .sort();
      return files.map(filename => {
        const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
        const parsed = matter(raw);
        return { filename, html: md.render(parsed.content), data: parsed.data };
      });
    } catch (error) {
      return [];
    }
  });

  // Read a content MD file and split its body on '### ' headings.
  // Returns { data, introHtml, blocks: [{ title, teachers, lead, icon, image, html }] }.
  // Per-block conventions: an italic '*(Name, Name)*' line right after the
  // heading is lifted out as `teachers`; a blockquote line '> One sentence.'
  // is lifted out as `lead`, the preview a template can show while the rest of
  // the block stays folded away; a standalone image line
  // '![alt](/path "object-position")' is lifted out as `image` (the path is
  // extensionless — the template builds the <picture> with .webp/.jpg);
  // `data.icons[title]` in the frontmatter supplies `icon`.
  // All three are removed from the body, so nothing renders twice.
  eleventyConfig.addFilter('pageSections', function(filename) {
    try {
      const contentPath = path.join(__dirname, 'src/content', filename);
      const raw = fs.readFileSync(contentPath, 'utf-8');
      const parsed = matter(raw);
      const parts = parsed.content.split(/^### +/m);
      const introHtml = md.render((parts.shift() || '').trim());
      const blocks = parts.map(part => {
        const lines = part.split('\n');
        const title = lines.shift().trim();
        let body = lines.join('\n');
        let teachers = null;
        const teacherMatch = body.match(/^\*\(([^)]+)\)\*\s*$/m);
        if (teacherMatch) {
          teachers = teacherMatch[1];
          body = body.replace(teacherMatch[0], '');
        }
        let lead = null;
        const leadMatch = body.match(/^> +(.+)$/m);
        if (leadMatch) {
          lead = leadMatch[1].trim();
          body = body.replace(leadMatch[0], '');
        }
        let image = null;
        const imageMatch = body.match(/^!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"([^"]+)")?\)\s*$/m);
        if (imageMatch) {
          image = { alt: imageMatch[1], src: imageMatch[2], position: imageMatch[3] || 'object-center' };
          body = body.replace(imageMatch[0], '');
        }
        const icon = (parsed.data.icons || {})[title] || null;
        return { title, teachers, lead, icon, image, html: md.render(body.trim()) };
      });
      return { data: parsed.data, introHtml, blocks };
    } catch (error) {
      return { data: {}, introHtml: '', blocks: [] };
    }
  });

  // Promote standalone markdown-styled title/subtitle paragraphs to semantic headings.
  //
  // Pass the page title so the opening bold line can be reconciled with it: the
  // layout already renders the title as the page's only <h1>, so promoting this
  // one to <h1> too gave every post two — and when the bold line just repeats the
  // title, the reader saw the same heading printed twice.
  eleventyConfig.addFilter('promoteMarkdownHeadings', function(html, pageTitle) {
    if (!html) return '';

    const stripTags = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    let output = html.replace(/<p><strong>([\s\S]*?)<\/strong><\/p>/, (match, inner) => {
      if (pageTitle && stripTags(inner).toLowerCase() === String(pageTitle).trim().toLowerCase()) {
        return '';
      }
      return `<h2>${inner}</h2>`;
    });

    // Standalone italic paragraphs -> H2
    output = output.replace(/<p><em>([\s\S]*?)<\/em><\/p>/g, '<h2>$1</h2>');

    return output;
  });
  
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });
  
  // Copy new scripts structure
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  
  // Give every <img> its intrinsic width and height.
  //
  // Without them the browser doesn't know how much room an image needs until it
  // has downloaded enough of it to find out, so everything below jumps down when
  // it arrives. That jump is Cumulative Layout Shift, one of the three Core Web
  // Vitals Google ranks on — and with ~20 photographs on the homepage it is the
  // cheapest of the three to fix. The attributes only declare the aspect ratio;
  // CSS still decides the displayed size, so `class="w-full"` keeps behaving
  // exactly as before.
  //
  // Done here rather than by hand because there are 178 <img> tags across 20
  // templates, several of them generated from Google Sheets data, and a build
  // step also covers whatever gets added next.
  // The schedule sheet writes dates as "29.02.2024 - 03.03.2024" (and sometimes a
  // single "29.02.2024"). Event schema needs ISO, so this turns one into the
  // other; anything it can't parse returns null and the caller skips the event
  // rather than emitting a malformed date.
  eleventyConfig.addFilter('isoDateRange', function (value) {
    const found = String(value || '').match(/\d{2}\.\d{2}\.\d{4}/g);
    if (!found || !found.length) return null;
    const iso = found.map(d => {
      const [day, month, year] = d.split('.');
      return `${year}-${month}-${day}`;
    });
    return { start: iso[0], end: iso[iso.length - 1] };
  });

  // Nunjucks has no notion of "now", and Event schema is only worth emitting for
  // events that haven't happened yet.
  eleventyConfig.addGlobalData('todayISO', () => new Date().toISOString().slice(0, 10));

  // Cached across the whole build: the same photo appears on several pages, and
  // sharp only reads the file header, but re-reading it 178 times is still waste.
  const dimensionCache = new Map();

  eleventyConfig.addTransform('imageDimensions', async function (content) {
    if (!(this.page.outputPath || '').endsWith('.html')) return content;

    const sharp = require('sharp');
    const prefix = process.env.PATH_PREFIX || '/';
    const tags = content.match(/<img\b[^>]*>/g);
    if (!tags) return content;

    let out = content;
    for (const tag of new Set(tags)) {
      if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) continue;

      const srcMatch = tag.match(/\ssrc="([^"]+)"/);
      if (!srcMatch) continue;
      const src = srcMatch[1];
      // Remote images (YouTube thumbnails) and SVG have nothing useful to read.
      if (/^https?:/i.test(src) || /\.svg$/i.test(src)) continue;

      let rel = src;
      if (prefix !== '/' && rel.startsWith(prefix)) rel = '/' + rel.slice(prefix.length);

      // Most images live in src/ and are passthrough-copied. The student photos
      // are the exception: practiceClients.js downloads them straight into _site
      // before templates render, so they only ever exist on the output side.
      let file = path.join(__dirname, 'src', rel);
      if (!fs.existsSync(file)) {
        const built = path.join(__dirname, '_site', rel);
        if (fs.existsSync(built)) file = built;
      }

      if (!dimensionCache.has(file)) {
        try {
          const meta = await sharp(file).metadata();
          dimensionCache.set(file, meta.width && meta.height ? meta : null);
        } catch (e) {
          // A missing file is not this transform's problem to report — the build
          // already fails elsewhere if an asset is genuinely absent.
          dimensionCache.set(file, null);
        }
      }
      const meta = dimensionCache.get(file);
      if (!meta) continue;

      const withDims = tag.replace(/<img\b/, `<img width="${meta.width}" height="${meta.height}"`);
      out = out.split(tag).join(withDims);
    }
    return out;
  });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/styles/**/*.css");
  eleventyConfig.addWatchTarget("src/scripts/**/*.js");
  eleventyConfig.addWatchTarget("src/assets/**/*");
  eleventyConfig.addWatchTarget("src/content/**/*.md");
  
  // Configuration
  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",          // Source files
      output: "_site",       // Built site
      includes: "_includes", // Layouts and partials
      data: "_data"         // Data files
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
