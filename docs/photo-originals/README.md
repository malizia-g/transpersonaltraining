# Photo originals

Sources of the site's photography — camera files for the school's own
photographs, unedited unless the table below says otherwise. They are the
sources of images published on the site, and are **not** published themselves,
since Eleventy only copies `src/assets/` to the built site.

Keep them here rather than in `src/assets/`: full-resolution phone files run
2–6 MB each, and dropping them in `src/assets/` would ship every one of them to
visitors.

## What each original became

| Original | Published as | Scene |
|---|---|---|
| `IMG-20260306-WA0014.jpg` | `Techniques/technique-shadow-work-fight` | Two pairs working on the floor, group behind |
| `IMG_20251120_193134.jpg` | `Techniques/technique-shadow-night-path` | Lamplit path through snow at night |
| `IMG_20260306_140341.jpg` | `Techniques/technique-paper-mandala-sunlight` | Torn paper laid out in sunlight on the studio floor |
| `IMG_20260306_140350.jpg` | `Techniques/technique-gestalt-fragments` | The same paper piece, second framing |
| `IMG_20260307_085849.jpg` | `Techniques/technique-somatic-tree-wound` | Healed wound in a mossy tree trunk |
| `IMG_20251121_074227.jpg` | — not used yet | Snowy forest track in daylight |
| `IMG_20260306_101334.jpg` | — not used yet | Moss and grasses arranged on the studio floor |
| `IMG_3096.JPG` | `People/teachers/lilian-gscheidel` | Lilian outdoors in front of greenery — rotated upright and cropped to a portrait |
| `Gemini_Generated_Image_srmvsasrmvsasrmv.jpg` | `Headers/hero-training-overview-breathwork-tent` | Group lying in a circle under an open-sided tent — school photograph, retouched with Gemini |

Published paths are relative to `src/assets/images/`, and each exists as both
`.jpg` and `.webp`.

## Turning an original into a site image

The published files follow the conventions already in
`src/assets/images/Techniques/`: longest edge **1600 px**, roughly **200 KB**
as `.jpg`, with a `.webp` companion beside it. Headers run wider — up to
1920 px.

```bash
# landscape 16:9 crop, or drop -vf for a straight resize
ffmpeg -i original.jpg -vf "scale=1600:-1" -q:v 4 technique-name.jpg
ffmpeg -i technique-name.jpg -q:v 80 technique-name.webp
```

Both files go in `src/assets/images/Techniques/`, and the page references them
through a `<picture>` element with the `.webp` as the `<source>`.

## Teacher portraits

`src/assets/images/People/teachers/` follows the same two-file rule, at a
smaller size: longest edge **1000 px** (the cards display them 280 px tall, so
this covers retina), `.jpg` around 40-130 KB with a `.webp` beside it.

The `.webp` is **required**, not an optimisation. `teachers.html` builds the
`<source>` path by swapping `.jpg` for `.webp` on whatever `image:` says in the
teacher's Markdown file, and a `<picture>` whose chosen `<source>` 404s does
*not* fall back to the `<img>` — the portrait simply disappears. Adding a
teacher means adding both files.

```bash
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('original.jpg')).convert('RGB')
im.thumbnail((1000, 1000), Image.LANCZOS)
im.save('teacher-name.jpg', quality=86, optimize=True, progressive=True)
im.save('teacher-name.webp', quality=82, method=6)"
```

See [`../MEDIA_ASSETS.md`](../MEDIA_ASSETS.md) for the video side.
