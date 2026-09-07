# The programme brochure

Downloadable documents live in `src/assets/documents/`, copied verbatim to
`_site/assets/documents/` by the passthrough rule in `.eleventy.js` and served
from our own domain.

> This note lives in `docs/` rather than beside the PDF because `src/` is an
> Eleventy input directory: a `.md` file left in `src/assets/` gets rendered as
> a page and lands in the sitemap.

## `transpersonal-training-brochure.pdf` — not yet added

*Tracked as [TODO task 44](TODO.md#task-44).*

The programme brochure is **designed by hand** and committed here; it is not
generated from the spreadsheet the way the curriculum PDF is.

Until the file exists, `src/_data/brochure.js` reports it as unavailable and
every download CTA hides itself, so nothing links to a 404. Drop the PDF in
with exactly this filename and rebuild — no template changes needed.

### Two things to get right in the PDF itself

The brochure is deliberately public and indexable: hosting it here rather than
on Google Drive means links and shares credit `transpersonal-training.com`
instead of `drive.google.com`. The cost of an indexable PDF is that it can rank
*instead of* an HTML page, and a PDF is a dead end — no navigation, no way
onward. Two cheap mitigations:

1. **Put the site URL on page 1**, with a line like *"Read the full programme
   online at transpersonal-training.com"*. Someone who arrives from a search
   result needs a way back to the site.
2. **Do not title the PDF with the exact primary keyword of an HTML page.**
   `/training-overview/` targets *transpersonal training for therapists* — if
   the PDF's title and metadata repeat that phrase, the two compete and Google
   may pick the PDF. Title it as a brochure ("Programme Brochure 2027–2030"),
   not as a landing page.

See `docs/SEO_KEYWORD_MAP.md` for the per-page keyword targets.
