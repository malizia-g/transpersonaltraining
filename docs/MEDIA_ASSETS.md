# Media Assets

Where the site's video and photography come from, and how the files in
`src/assets/` were produced from them. Originals are deliberately **not** kept
in `src/assets/` — that folder is passthrough-copied to the built site by
Eleventy, so anything in it is published.

---

## Homepage hero video

The homepage hero is a drone shot of the sun setting over woodland.

| | |
|---|---|
| Stock file name | `15653095_1280_720_30fps.mp4` |
| Master specs | 1280×720, 30 fps (30000/1001), h264, 22.99 s, 1.73 Mbps, 4.96 MB |
| In the repo | `src/assets/videos/hero-sunset-720.mp4`, `src/assets/videos/hero-sunset-540.mp4` |
| Poster | `src/assets/images/Headers/hero-homepage-sunset.jpg` / `.webp` |
| Wired up in | `src/index.html` — the inline script in the `<header>` |

**The master is not kept in this repo.** Re-download it from the stock
provider using the file name above; the licence and purchase record are with
the school's account. The name follows the `id_width_height_fps` pattern, so
`15653095` is the asset id on the provider's site.

Losing the master costs little: the 720p rendition in the repo is at the
master's own resolution and is only trimmed and recompressed. Re-download it
if you ever need to re-grade or re-cut the clip.

### How the renditions were made

Every hero clip on this site gets the same treatment:

- **Two renditions**, picked at runtime by screen size and connection — the
  smaller one for phones and 3g, the larger otherwise. No video at all is
  loaded for 2g, data-saver or `prefers-reduced-motion` users; the poster
  image stays instead.
- **Never upscaled.** The pair tops out at the source resolution, which is why
  this clip ships 720p/540p while the earlier leaves clip shipped 432p/288p.
- **First frame as poster**, exported to `.jpg` and `.webp` in
  `src/assets/images/Headers/`.
- **`-movflags +faststart`**, so playback begins before the whole file lands.
- **No audio track** — the video is muted and looping.
- **Trimmed from 1.5 s in.** Before that the drone is still rising through a
  near-black silhouette, which makes a poor first frame and a poor poster.

Resulting specs:

| Rendition | Size | Duration | Bitrate | File size |
|---|---|---|---|---|
| `hero-sunset-720.mp4` | 1280×720 | 21.49 s | 1.15 Mbps | 3.1 MB |
| `hero-sunset-540.mp4` | 960×540 | 21.49 s | 558 kbps | 1.5 MB |

To reproduce from a fresh download:

```bash
ffmpeg -ss 1.5 -i 15653095_1280_720_30fps.mp4 \
  -vf scale=1280:720 -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 24 -preset slow -an -movflags +faststart hero-sunset-720.mp4

ffmpeg -ss 1.5 -i 15653095_1280_720_30fps.mp4 \
  -vf scale=960:540 -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 24 -preset slow -an -movflags +faststart hero-sunset-540.mp4
```

The exact CRF used for the files in the repo was not recorded; 24 lands in the
right neighbourhood. Check the output bitrate against the table above.

---

## Clips that were removed

Kept here so nobody re-adds them by mistake.

| Clip | Why it went |
|---|---|
| `hero-leaves-288.mp4` / `-432.mp4` | iStock **free preview** of asset `2227197804` — a watermark sits across the middle and the resolution is a fraction of the licensed download. It was only ever meant for judging mood on a noindex staging page. Replaced by the sunset clip. |
| `hero-dawn-270.mp4` / `-404.mp4` | Shot on a phone, vertically, at 720×1280 and cropped to 16:9, so 720×404 was all the source gave. Only ever lived on the `homepage-warmth-variants` branch; never adopted. |
| `hero-540.mp4` / `hero-720.mp4` | The original mountain-stream clip. Nothing had referenced it since the leaves clip went in. |
| `forest-stream.mp4` | Superseded long before the above; still on `main`. |

The `homepage-warmth-variants` branch keeps all of these if one is ever wanted
back.

---

## Photography

Camera originals of the school's own photographs live in
[`photo-originals/`](photo-originals/), with a README mapping each one to the
image it became. Everything published is derived from those and sits in
`src/assets/images/`.
