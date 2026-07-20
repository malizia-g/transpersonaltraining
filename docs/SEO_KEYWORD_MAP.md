# Keyword map — one row per page

> **This file is the source of truth** for which keyword each page targets. It supersedes the page
> assignments in the Drive [Cluster Keywords Map](https://docs.google.com/spreadsheets/d/1vyGrnHLGvWC4gvbL3UU0zgpHoGUVsnvc2H2yaulVxyg)
> and the section structure of [WEBSITE_CONTENT.md](WEBSITE_CONTENT.md), both written when the site
> had a different page structure.
>
> Companion documents: [MARKETING_AND_SEO.md](MARKETING_AND_SEO.md) (the plan; this replaces its D1
> table), [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md) (what actually ranks today).
>
> *Created 2026-07-20.*

## Why this file exists

The keyword research assigned targets to 13 "pages", only 3 of which matched a real page name. The
site publishes 18. The pages were not missing — **they had been renamed**. This file records the
resolved mapping so the next person doesn't have to re-derive it.

Two facts from the Search Console baseline shape every choice below:

1. **Nothing commercial ranks.** `transpersonal psychology course`, `transpersonal coaching`,
   `transpersonal psychology certificate` all sit at positions 50–88 with **zero clicks**. There is no
   ranking to protect — only ground to take.
2. **Teacher-name searches are 64% of all clicks**, at positions 3–8. `/teachers/` is the single most
   valuable page on the site and, after the migration, absorbs 32 old bio URLs.

## Title length budget

`eleventy-plugin-seo` appends ` | Transpersonal Training` — **25 characters** — to every front-matter
title (`src/_data/seo.js`). To land under ~60 rendered characters, **the front-matter title must be
≤ 38 characters**. The suffix is not wasted: "Transpersonal Training" is the homepage primary keyword.

---

## Section of WEBSITE_CONTENT.md → real page

| Doc section | Page |
|---|---|
| 🏠 HOME PAGE | `/` |
| 🚵 Training *(group heading)* | "Training" nav dropdown, not a page |
| Training program overview | `/training-overview/` |
| Curriculum | `/curriculum/` |
| Who is this training for · Eligibility · Admissions | inside `/training-overview/` (`src/content/training-overview/`) |
| Intensive schedules *(TODO in doc)* | `/schedule/` |
| Lectures schedule *(TODO in doc)* | `/lectures-schedule/` |
| Teachers *(TO DO in doc)* | `/teachers/` |
| 🐉 Transpersonal Therapy *(group heading)* | "Resources" nav dropdown, not a page |
| What is transpersonal psychology | `/what-is-transpersonal-psychology/` |
| Became a client model | `/become-a-client-model/` |
| Techniques/Skills | `/techniques/` |
| **Is transpersonal psychology for me?** | **no page yet** — real content (clinical indications and contraindications). Best home: a section of `/what-is-transpersonal-psychology/` |
| 🤓 Blog *(group heading)* | `/blog/` |
| The History of Transpersonal Psychology | `/blog/the-history-of-transpersonal-psychology/` |
| How Transpersonal Psychology Differs | `/blog/how-transpersonal-psychology-differs/` |

**Site pages the doc never mentions:** `/venues/`, `/resources/`, `/collaborations/`, `/apply/`,
`/legal-notice/`, and the Medicine Wheel blog post. Keywords assigned below.

---

## The map

Primary keyword goes first in the title. Volumes and difficulty from the Drive *Selecting Keywords*
sheet.

| Page | Primary keyword | Secondary | Front-matter title (≤38) |
|---|---|---|---|
| `/` | transpersonal psychotherapy training | transpersonal psychology training, counselling courses online, hero journey | `Transpersonal Psychotherapy Training` |
| `/training-overview/` | transpersonal training for therapists | self development, shadow work, spiritual crisis, **transpersonal psychology degree europe, eurotas accreditation** | `Transpersonal Training for Therapists and Self-Development` |
| `/curriculum/` | transpersonal psychotherapy curriculum | counselling skills, psychotherapy skills, holotropic breathwork | `Transpersonal Psychotherapy Curriculum` |
| `/teachers/` ⭐ | transpersonal psychotherapy teachers | **the teachers' own names** — 64% of all clicks | `Transpersonal Psychotherapy Teachers` |
| `/what-is-transpersonal-psychology/` | what is transpersonal psychology | transpersonal psychotherapy, hero journey, non-ordinary states of consciousness, integrative therapy education | `What is Transpersonal Psychology?` |
| `/techniques/` | holotropic breathwork | breathwork certification, somatic healing, gestalt, breathwork for anxiety | `Holotropic Breathwork Training` |
| `/become-a-client-model/` | free counselling | breathwork seminars free, free psychotherapy, behaviour pattern, repeating cycles, spiritual crisis, spiritual emergency | `Free Counselling & Breathwork` |
| `/schedule/` | breathwork seminars | holotropic breathwork intensives, residential training Europe | `Breathwork Intensives & Seminars` |
| `/venues/` | breathwork retreat Germany | training venues Italy, Black Forest, Tuscany | `Training Venues in Germany & Italy` |
| `/collaborations/` | eurotas accredited psychotherapy schools | transpersonal psychology institutes Europe | `EUROTAS Partner Institutes` |
| `/apply/` | transpersonal counselling certification | apply transpersonal training, enrolment | `Apply — Transpersonal Training` |
| `/resources/` | transpersonal psychology books | Grof, Campbell, recommended reading | `Transpersonal Psychology Reading` |
| `/blog/` | transpersonal psychology articles | topic hub | `Our Hero's Journey Blog` |
| `/blog/the-heros-journey/` ⭐ | hero journey | Campbell, personal transformation, myth, individuation | `The Hero's Journey & Personal Transformation` |
| `/lectures-schedule/` | transpersonal psychology training online | holotropic breathwork intensives, online psychotherapy training | `Transpersonal Psychology Online Lectures` |
| `/legal-notice/` | — no target | — | `Legal Notice — Professional Title` |

⭐ `/teachers/` is the priority. Because all 32 bio URLs redirect here, the **meta description should
name the highest-demand teachers** — that is what helps the page surface on name searches:
Pier Luigi Lattuada (4,850 impressions), Jure Biechonski (26 clicks), Manal Al-Hammadi (25),
Stephan Schillinger, Stefan Dressler, Kirsten Cameron.

### High-value keywords still unassigned

Worth a page when there is capacity to write one — all low difficulty:

- `transpersonal psychotherapy` — 320/mo, **difficulty 2**. Currently spread thin; consider making it
  the explicit focus of `/what-is-transpersonal-psychology/`
- `transpersonal psychology degree europe` (difficulty 5) and `eurotas accredited psychotherapy
  schools` — an **Accreditation page** would own both (Marketing plan Phase F)
- `hero journey` — 3,600/mo, difficulty 19, the biggest volume in the research. Content already exists
  in `src/curriculum.html` and `src/content/training-overview/02-program-overview.md` but is not
  developed enough to rank

### Open decision — the `/training-overview/` URL

WEBSITE_CONTENT.md proposes `URL: /holistic_Therapy_for_self_development` ("this is good for seo").
The instinct is right — `/training-overview/` contains no keyword — but the proposed form uses
underscores and capitals, against URL conventions. The site is not live yet, so a change is cheap; it
would need the matching row in [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md) updated.
**Not changed** pending a decision between keeping `/training-overview/` and moving to
`/transpersonal-psychotherapy-training/`.

---

## ⚠️ Factual conflicts between WEBSITE_CONTENT.md and the site

**These are not SEO issues — they are wrong facts, and they block writing any new copy from the doc.**
The site's figures are the authoritative ones: they also appear in `src/_data/agreement-fallback.html`,
i.e. inside the enrolment agreement the applicant signs.

| Fact | WEBSITE_CONTENT.md | Site + enrolment agreement |
|---|---|---|
| Module fee | €579 (single price) | **€489 Eastern / €689 Western** |
| Whole training | €6,948 | not published — paid module by module |
| Single lecture | €30 | **€45** |
| Cohort | "2024 – 2027" | **2027–2030** |
| Module count | "13 modules" in the body, but the Curriculum lists **14** | internal contradiction in the doc |

Also to resolve in the doc:

- [ ] Links to WordPress URLs that die at migration: `/schedule/#tab-id-2`, `/program/`,
      `/wp-content/uploads/2024/01/…pdf`, and **`/participate/`, which does not exist on the new site**
- [ ] Second email `ewtts@posteo.de` alongside `office@transpersonal-training.com` — keep or drop?
- [ ] Typo "EURTOS" → EUROTAS
- [ ] Doc note: *"Entry Requirements: Degree (there should be a hyperlink…)"* → link to
      `/training-overview/` eligibility section
- [ ] Doc note: *"I DONT KNOW WHERE THIS GOES"* on the **"Is the programme for me?"** block →
      suggested home: `/training-overview/`, above the eligibility list
- [ ] Doc note: *"STUDENTS PAGE — this needs to be called something else"* → ambiguous: the
      `student.` portal, or `/lectures-schedule/`?

**Decisions for Fabio/Pablo.** Nothing in the doc should be published as copy until the fee rows agree
with `training-overview.html`.
