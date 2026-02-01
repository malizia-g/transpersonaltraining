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
  eleventyConfig.addPassthroughCopy("*.mp4");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("assets");
  
  // Copy new scripts structure
  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });
  
  // Legacy JS files (for backwards compatibility with non-Eleventy pages)
  eleventyConfig.addPassthroughCopy("schedule-app.js");
  eleventyConfig.addPassthroughCopy("vine.js");
  
  // These pages keep their old HTML format for now (can be converted later if needed)
  eleventyConfig.addPassthroughCopy("teachers.html");
  eleventyConfig.addPassthroughCopy("teachers_testB.html");
  eleventyConfig.addPassthroughCopy("teachers_testC.html");
  eleventyConfig.addPassthroughCopy("transpersonal_therapist.html");
  eleventyConfig.addPassthroughCopy("client_model.html");
  eleventyConfig.addPassthroughCopy("hero_journey.html");
  
  // Watch for changes
  eleventyConfig.addWatchTarget("style.css");
  eleventyConfig.addWatchTarget("src/styles/**/*.css");
  eleventyConfig.addWatchTarget("src/scripts/**/*.js");
  
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
