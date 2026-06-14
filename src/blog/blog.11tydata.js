module.exports = {
  eleventyComputed: {
    layout: (data) => {
      if (data.page && data.page.inputPath && data.page.inputPath.endsWith('.md')) {
        return 'blog_article.njk';
      }
      return data.layout;
    },
    permalink: (data) => {
      if (data.page && data.page.inputPath && data.page.inputPath.endsWith('.md')) {
        return `/blog/${data.page.fileSlug}/`;
      }
      return data.permalink;
    }
  }
};
