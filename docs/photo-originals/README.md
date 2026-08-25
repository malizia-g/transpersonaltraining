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

## Hero crops

Heroes sit in a container whose shape changes with the viewport — `h-[50vh]
min-h-[400px]` at full width — so `object-cover` shows a different part of the
photo on a phone than on a desktop. A source at 1920x1080 shows all its width
and half its height at 1920x1080, but all its height and half its width at
390x844. One file cannot be cropped to suit both.

Where it pays, the hero is therefore cut into two files, chosen with
`<source media="(min-width: 1024px)">`:

- `-wide` — full width, the middle 60% of the height, centred on whatever
  `object-position` the page used before. This is what wide screens already
  saw, minus the pixels they were never shown.
- `-narrow` — full height, cropped to roughly 10:9, for phones and tablets.

The `object-position` then comes off the `<img>`: the framing lives in the
files, and below 1024 px `object-cover` crops nothing vertically anyway.

Two rules learned the hard way, both worth re-checking per image rather than
assuming:

- **WebP is not always smaller.** On grainy or noisy photographs it loses to
  JPEG outright. Generate both, compare, and keep the WebP only if it saves
  more than 20%; otherwise ship the JPEG alone and drop the `<source>`.
- **The crop is not always worth it.** Four heroes gained under 10% and were
  left as single files. Measure before adding a second file.

The uncropped masters of cropped heroes live here, since the two crops cannot
be reassembled into the original if the layout changes again.

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
