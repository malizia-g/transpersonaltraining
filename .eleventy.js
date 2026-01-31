module.exports = function(eleventyConfig) {
  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("*.js");
  eleventyConfig.addPassthroughCopy("*.css");
  eleventyConfig.addPassthroughCopy("*.mp4");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(".vscode");
  
  // These pages keep their old HTML format for now (can be converted later if needed)
  eleventyConfig.addPassthroughCopy("teachers.html");
  eleventyConfig.addPassthroughCopy("teachers_testB.html");
  eleventyConfig.addPassthroughCopy("teachers_testC.html");
  eleventyConfig.addPassthroughCopy("transpersonal_therapist.html");
  eleventyConfig.addPassthroughCopy("client_model.html");
  eleventyConfig.addPassthroughCopy("hero_journey.html");
  
  // Watch for changes in these files
  eleventyConfig.addWatchTarget("*.js");
  eleventyConfig.addWatchTarget("*.css");
  eleventyConfig.addWatchTarget("*.html");
  
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
