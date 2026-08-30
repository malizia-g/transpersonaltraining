// Apply pathPrefix to root-relative links written by hand inside markdown.
//
// Templates reach Eleventy's `url` filter, which is how the rest of the site
// gets its prefix. Markdown rendered by a bare markdown-it instance never does,
// so an author writing [text](/training-overview/) — or a raw <a
// href="/legal-notice/">, which markdown-it passes through untouched when
// html:true — produces a link that resolves against the domain root. On the
// project-site build at /transpersonaltraining/ that is a 404. The home page's
// legal-notice asterisk had been broken that way.
//
// EleventyHtmlBasePlugin is the usual answer, but it transforms finished HTML
// and would prefix a second time on top of every `url` filter call already in
// the templates. Wrapping render() instead touches only the markdown, which is
// exactly the part the filter cannot reach.

/**
 * Wrap a markdown-it instance so its output carries the path prefix.
 * A no-op when the site is served from the root.
 * @param {object} md a markdown-it instance, mutated in place
 * @returns {object} the same instance
 */
function prefixMarkdownLinks(md) {
  const pathPrefix = process.env.PATH_PREFIX || '/';
  if (pathPrefix === '/') return md;

  const prefix = '/' + pathPrefix.replace(/^\/+|\/+$/g, '');
  const render = md.render.bind(md);

  md.render = (src, env) =>
    render(src, env).replace(/(\s(?:href|src)=")(\/(?!\/)[^"]*)"/g, (match, attr, url) =>
      // Already prefixed, or the prefix itself — leave it alone, so this stays
      // safe if a link is ever written with the prefix already on it.
      url === prefix || url.startsWith(prefix + '/') ? match : `${attr}${prefix}${url}"`
    );

  return md;
}

module.exports = { prefixMarkdownLinks };
