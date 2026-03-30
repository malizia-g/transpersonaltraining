// RIMOSSA dichiarazione superflua di module.exports
const markdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
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
  // Filter to check if a string starts with a prefix (used in sitemap)
  eleventyConfig.addFilter('startsWith', function(str, prefix) {
    if (!str || !prefix) return false;
    return str.startsWith(prefix);
  });
  // Collezione blog: tutti i markdown in src/blog/
  eleventyConfig.addCollection('blog', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/blog/*.md');
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
