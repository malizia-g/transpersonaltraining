const markdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
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
