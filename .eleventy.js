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
  
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  
  // Copy new scripts structure
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  
  // Legacy JS files (for backwards compatibility with non-Eleventy pages)
  eleventyConfig.addPassthroughCopy("schedule-app.js");
  
  // Legacy HTML page (to be migrated)
  eleventyConfig.addPassthroughCopy("teachers.html");
  
  // Test files (optional, in TESTS folder)
  eleventyConfig.addPassthroughCopy({ "TESTS": "TESTS" });
  
  // Watch for changes
  eleventyConfig.addWatchTarget("style.css");
  eleventyConfig.addWatchTarget("src/styles/**/*.css");
  eleventyConfig.addWatchTarget("src/scripts/**/*.js");
  eleventyConfig.addWatchTarget("src/assets/**/*");
  
  // Configuration
  return {
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
