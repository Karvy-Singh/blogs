const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownItKatex = require("@vscode/markdown-it-katex").default;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.amendLibrary("md", (markdownLibrary) => {
    markdownLibrary.use(markdownItKatex, {
      throwOnError: false,
      errorColor: "#9b341f"
    });
  });

  eleventyConfig.addPassthroughCopy({
    "styles.css": "styles.css",
    "finalsidebar.png": "finalsidebar.png",
    "node_modules/katex/dist/katex.min.css": "katex/katex.min.css",
    "node_modules/katex/dist/fonts": "katex/fonts"
  });

  const posts = (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("posts", posts);
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const categories = posts(collectionApi).flatMap(
      (post) => post.data.categories || []
    );

    return [...new Set(categories)].sort();
  });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    }).format(new Date(date))
  );

  eleventyConfig.addFilter("htmlDate", (date) =>
    new Date(date).toISOString().slice(0, 10)
  );

  eleventyConfig.addFilter("rfcDate", (date) =>
    new Date(date).toUTCString()
  );

  eleventyConfig.addFilter("absoluteUrl", (url, base) =>
    new URL(url, base).toString()
  );

  eleventyConfig.addFilter("postsForCategory", (allPosts, category) =>
    allPosts.filter((post) =>
      (post.data.categories || []).includes(category)
    )
  );

  eleventyConfig.addFilter(
    "relatedPosts",
    (allPosts, currentUrl, categories = []) => {
      const otherPosts = allPosts.filter((post) => post.url !== currentUrl);
      const sameCategory = otherPosts.filter((post) =>
        (post.data.categories || []).some((category) =>
          categories.includes(category)
        )
      );
      const globalFallback = otherPosts.filter(
        (post) => !sameCategory.includes(post)
      );

      return [...sameCategory, ...globalFallback].slice(0, 2);
    }
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
