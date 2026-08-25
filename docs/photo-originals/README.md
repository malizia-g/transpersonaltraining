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

See [`../MEDIA_ASSETS.md`](../MEDIA_ASSETS.md) for the video side.
