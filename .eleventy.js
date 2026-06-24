const pluginSEO = require('eleventy-plugin-seo');
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
  // Collezione blog: tutti i markdown in src/blog/
  eleventyConfig.addCollection('blog', function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob('src/blog/*.md');
    posts.forEach(validateBlogPost);
    return posts;
  });
  // Markdown instance
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
  
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
  // dir is relative to src/content/ (e.g. 'techniques/cards')
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

  // Promote standalone markdown-styled title/subtitle paragraphs to semantic headings
  eleventyConfig.addFilter('promoteMarkdownHeadings', function(html) {
    if (!html) return '';

    let output = html;

    // First standalone bold paragraph -> H1
    output = output.replace(/<p><strong>([\s\S]*?)<\/strong><\/p>/, '<h1>$1</h1>');

    // Standalone italic paragraphs -> H2
    output = output.replace(/<p><em>([\s\S]*?)<\/em><\/p>/g, '<h2>$1</h2>');

    return output;
  });
  
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  
  // Copy new scripts structure
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  
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
