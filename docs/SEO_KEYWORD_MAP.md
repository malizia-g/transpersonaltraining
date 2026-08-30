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

> **Corrected 2026-08-24.** This section used to say the plugin appends
> ` | Transpersonal Training` (25 chars), leaving a 38-character budget. That is no longer true:
> `src/_data/seo.js` now sets `titleStyle: 'minimalistic'`, which suppresses the suffix — verified
> against the built output, where `/curriculum/` renders exactly `Transpersonal Psychotherapy
> Curriculum` and nothing more. The front-matter title *is* the whole `<title>`.

The front-matter title is rendered verbatim, so **the budget is the full ~60 characters** and each
page must carry its own brand signal if it wants one. Two consequences worth remembering:

- Titles written under the old 38-character rule are now shorter than they need to be — there is
  room to add a qualifier or the brand.
- The homepage still overruns at **81 characters**
  (`Transpersonal Psychotherapy & Holotropic Breathwork Training | EUROTAS Accredited`) and is
  truncated in results. Worth shortening.

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
| Became a practice client | `/become-a-practice-client/` |
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
| `/become-a-practice-client/` | free counselling | breathwork seminars free, free psychotherapy, behaviour pattern, repeating cycles, spiritual crisis, spiritual emergency | `Free Counselling & Breathwork` |
| `/schedule/` | breathwork seminars | holotropic breathwork intensives, residential training Europe | `Breathwork Intensives & Seminars` |
| `/venues/` | breathwork retreat Germany | training venues Italy, Black Forest, Tuscany | `Training Venues in Germany & Italy` |
| `/collaborations/` | eurotas accredited psychotherapy schools | transpersonal psychology institutes Europe | `EUROTAS Partner Institutes` |
| `/apply/` | transpersonal counselling certification | apply transpersonal training, enrolment | `Apply — Transpersonal Training` |
| `/sample-lesson/` | free transpersonal psychology lesson | transpersonal psychotherapy lecture, transpersonal psychology video | `Free Transpersonal Psychology Lesson` |
| `/resources/` | transpersonal psychology books | Grof, Campbell, recommended reading | `Transpersonal Psychology Reading` |
| `/blog/` | transpersonal psychology articles | topic hub | `Our Hero's Journey Blog` |
| `/blog/the-heros-journey/` ⭐ | hero journey | Campbell, personal transformation, myth, individuation | `The Hero's Journey & Personal Transformation` |
| `/lectures-schedule/` | transpersonal psychology training online | holotropic breathwork intensives, online psychotherapy training | `Transpersonal Psychology Online Lectures` |
| `/legal-notice/` | — no target | — | `Legal Notice — Professional Title` |

⭐ `/teachers/` is the priority. Because all 32 bio URLs redirect here, the **meta description should
name the highest-demand teachers** — that is what helps the page surface on name searches:
Pier Luigi Lattuada (4,850 impressions), Jure Biechonski (26 clicks), Manal Al-Hammadi (25),
Stephan Schillinger, Stefan Dressler, Kirsten Cameron.

### Funnel restructure — August 2026

> **Superseded 2026-08-24.** The reasoning below changed again the same month, after the "Enrol"
> nav button turned out to confuse a lot more than it converted:
>
> - **`/apply/` is reached from the Resources dropdown, not the top nav.** The nav's one CTA
>   button is now "Request a Demo", linking to the homepage contact form from any page — not
>   `/apply/`. "Enrol" does not appear anywhere on the site any more; where the front-matter title
>   above still said `Enrol — Transpersonal Training`, it is now `Apply — Transpersonal Training`.
> - **The homepage hero no longer offers the sample lesson directly.** Its two buttons are
>   "Request a Demo" (→ the contact form) and "Explore the Training Overview". The "Two ways to
>   see what this is" section became a four-card "Start here": Request a Demo, Training Overview,
>   a monthly Zoom call (`/monthly-call/`, new — no keyword target yet, it is a placeholder with no
>   scheduled dates and therefore nothing to rank on), and the curriculum.
> - **`/sample-lesson/` is no longer linked from anywhere on the site** — not the nav, not the
>   homepage, not `/apply/`. It is sent only as a direct link in the contact-form auto-reply. This
>   reverses the "both lead magnets are public and indexable" reasoning below: the page is still
>   live, still indexable and still in the sitemap, but with zero internal links pointing at it, it
>   has lost the discovery and link-equity path that made "index it instead of gating it" worth
>   doing in the first place. Whether that trade-off still makes sense for organic traffic is worth
>   revisiting.
> - **The "Is this programme for you?" content did not move to `/apply/`.** It was rewritten as
>   "Why Is This Training for You?" inside `/training-overview/` (kept open, next to Philosophy)
>   and dropped from the homepage entirely, rather than duplicated on `/apply/`. `/apply/` itself
>   was trimmed of the sections that argued the same case, on the reasoning that they duplicated
>   `/training-overview/` — see the pointer line in its hero.

The homepage no longer leads with "Apply". Its hero now offers a sample lesson and the brochure,
because the Search Console baseline shows visitors arriving on discovery intent, not transactional
intent — **zero clicks on every commercial query**, at positions 50–88. A homepage whose only
above-fold action was "Apply for the 2027–2030 cohort" was answering a question almost nobody in
the audience was asking yet.

Three decisions worth recording, because each one had an obvious-looking alternative:

- **`/apply/` absorbed the persuasion content instead of a new `/enrol/` page being created.**
  "Why this is for you / what you get / testimonials" already existed on the homepage and inside
  `/training-overview/`; a third page making the same argument would have set all three competing
  on the same intent. The enrolment form now sits at the bottom of the page that argues for it.
- **The "Is this programme for you?" list moved off the homepage** (where it was inside a collapsed
  `<details>` nobody opened) onto `/apply/`, rather than being duplicated.
- **Both lead magnets are public and indexable — neither is gated.** A brochure or a lesson behind
  an email wall produces no crawlable content at all. `/sample-lesson/` carries the video *and its
  full transcript*, which is the part that can actually rank; the PDF is self-hosted under
  `/assets/documents/` rather than served from Drive, so links to it credit this domain instead of
  `drive.google.com`. The trade-off, accepted deliberately: nobody is captured on download. The
  contact form is the capture, and its auto-reply carries both assets. See `docs/BROCHURE.md`.

### High-value keywords still unassigned

Worth a page when there is capacity to write one — all low difficulty. The work these imply is
[TODO 53](TODO.md#task-53) (focus), [TODO 27](TODO.md#task-27) (Accreditation page) and
[TODO 42](TODO.md#task-42) (the Hero's Journey title):

- `transpersonal psychotherapy` — 320/mo, **difficulty 2**. Currently spread thin; consider making it
  the explicit focus of `/what-is-transpersonal-psychology/`
- `transpersonal psychology degree europe` (difficulty 5) and `eurotas accredited psychotherapy
  schools` — an **Accreditation page** would own both (Marketing plan Phase F)
- `hero journey` — 3,600/mo, difficulty 19, the biggest volume in the research. Partly addressed
  (Jul 2026): a blog post now exists — `/blog/the-heros-journey-in-transpersonal-work/`, "The Hero's
  Journey in Transpersonal Work", byline Fabio Malizia — but it shipped under a different URL and
  title than this map originally specified (`/blog/the-heros-journey/`, "The Hero's Journey &
  Personal Transformation"), and the exact phrase "hero journey"/"hero's journey" carries the
  keyword rather than being the title's leading phrase. Worth deciding whether to retitle/rename for
  the exact-match SEO benefit, or treat the current title as final and accept the softer match.
  `src/curriculum.html` and `02-program-overview.md` still carry supporting content.

## Long-tail phrase coverage

> Audit against the Drive [SEO Longtail Keywords](https://docs.google.com/document/d/10fWmPbUOrqP2YLXMonK9G3jaxAPJA8mnzzj9SohCjKE)
> doc (41 phrases across 7 audience categories — its own numbering skips "7"). Checked against actual
> page/blog copy, not just titles. *Audited 2026-07-20.*
>
> ✅ = the phrase's intent is directly addressed by existing content · 🟡 = the topic is touched but not
> this specific angle or wording · ❌ = nothing on the site addresses this search intent at all.

### 1. Personal Growth — persona 5, TOFU

| Phrase | Status | Note |
|---|---|---|
| courses for deep spiritual awakening and integration | 🟡 | "spiritual awakening" appears (2 files) but no page frames Level 1 this way |
| hero's journey workshops for self-discovery | 🟡 | covered by the new blog post, but as an article, not a "workshop"; "self-discovery" isn't used |
| holotropic breathwork retreats for personal transformation | 🟡 | `/schedule/` + `/venues/` cover the logistics, "personal transformation" isn't tied to them |
| training in expanded states of consciousness for beginners | ❌ | site only ever says "non-ordinary states," never "expanded states"; nothing is framed "for beginners" |
| transpersonal development programs for inner peace | ❌ | "inner peace" appears nowhere on the site |

### 2. Personal Therapy — persona 4, TOFU (searchers want to *book a session*, not enrol)

| Phrase | Status | Note |
|---|---|---|
| transpersonal therapists specializing in spiritual crisis | 🟡 | `/become-a-practice-client/` mentions spiritual crisis, framed as free trainee sessions, not "find a specialist" |
| holotropic breathwork sessions for trauma healing | 🟡 | "trauma" is common (13 files) but almost always training-context, not a "book a session" page |
| find a therapist who uses shamanic and integral methods | ❌ | no therapist-finder / directory intent exists anywhere |
| body-oriented psychotherapy for emotional release | ❌ | — |
| transpersonal counseling for existential depression | ❌ | "existential depression" — zero hits |
| integration therapy for psychedelic or breathwork experiences | ❌ | "integration therapy" — zero hits (though "psychedelic" itself appears 5×) |

**Structural note:** this whole category is a weaker fit for the site as it stands — the school sells
*training*, not therapy sessions, and `/become-a-practice-client/` is the only page positioned to capture
this intent at all. Closing these gaps may mean deciding how far to lean into "book a session with a
trainee" as a page, rather than just adding copy.

### 3. Not satisfied with classical psychotherapy — persona 4, TOFU (best-covered category)

| Phrase | Status | Note |
|---|---|---|
| alternatives to talk therapy for deep healing | 🟡 | conceptually covered by `how-transpersonal-psychology-differs.md`, exact phrase not used |
| psychotherapy that includes the spiritual dimension | ✅ | effectively the thesis of that post + `/what-is-transpersonal-psychology/` |
| why classical therapy isn't working for my spiritual anxiety | 🟡 | the answer exists, not phrased as this question — good future blog title (personal, TOFU) |
| holistic mental health approaches beyond CBT | ✅ | the post explicitly discusses CBT's limits |
| therapy focusing on soul and consciousness rather than just symptoms | ✅ | `/what-is-transpersonal-psychology/`'s description says almost exactly this |
| somatic and breathwork based therapy vs traditional analysis | 🟡 | both sides exist on the site (Techniques; the differs post) but never as one head-to-head comparison |

### 4. Counselling School — persona 2, BOFU/MOFU

| Phrase | Status | Note |
|---|---|---|
| certification in transpersonal counseling and guidance | ✅ | = Curriculum Level 2, "Counselling Skills & Professional Facilitation" |
| how to become a spiritual counselor with european accreditation | 🟡 | EUROTAS is mentioned; no page tells the "how to become" career story |
| holistic counseling training programs online and in person | ✅ | Training Overview explains online lectures + in-person intensives |
| counseling schools that teach breathwork and meditation | 🟡 | true, but never stated as one combined value proposition |
| career change to transpersonal counseling therapist | ❌ | this is exactly the still-unbuilt **Transpersonal Therapist (career) page** |
| EUROTAS accredited counseling skills training | ✅ | Curriculum Level 2 description says close to this verbatim |

### 5. Psychotherapy School — persona 1, BOFU

| Phrase | Status | Note |
|---|---|---|
| comprehensive training in transpersonal psychotherapy Europe | ✅ | Homepage + Training Overview |
| post-graduate certificate in integral transpersonal psychology | 🟡 | certificates are described per level; "post-graduate" and "integral" framing aren't used |
| psychotherapy schools teaching Grof breathwork and biotransenergetics | 🟡 | "biotransenergetics" only appears in 2 teacher bios, not on Curriculum/Training Overview |
| become a certified transpersonal psychotherapist eurotas | ✅ | Curriculum Level 3 + EUROTAS mentioned throughout |
| integral psychotherapy training for mental health professionals | 🟡 | audience isn't explicitly addressed as "mental health professionals" |
| clinical training in consciousness-based psychotherapy | 🟡 | "clinical" framing is thin |

### 6. Eurotas Certification — persona 1, BOFU (structurally the weakest category)

| Phrase | Status | Note |
|---|---|---|
| how to get eurotas transpersonal psychotherapist certification | 🟡 | — |
| eurotas accredited training institutes for breathwork and therapy | 🟡 | — |
| european transpersonal association certification requirements | ❌ | — |
| accredited path to become a eurotas certified therapist | 🟡 | — |
| transpersonal psychology training recognized by eurotas global network | 🟡 | — |
| psychotherapy certification valid in europe transpersonal field | ❌ | — |

EUROTAS itself is mentioned on Training Overview, Curriculum and `/collaborations/`, so this category
isn't invisible — but every phrase in it wants a single authoritative landing page, and that page (the
**Accreditation page**, [TODO task 27](TODO.md#task-27), Marketing plan Phase F) still doesn't exist.
Building it would move most of this row from 🟡 to ✅ in one page.

### 8. Breathwork Techniques — persona 3, MOFU

| Phrase | Status | Note |
|---|---|---|
| holotropic breathwork certification training europe | ✅ | Techniques + Curriculum Level 3 |
| grof breathwork facilitator training requirements | 🟡 | facilitator path exists (Level 3); Grof isn't consistently named on `/techniques/` itself |
| transpersonal breathwork techniques for trauma release | 🟡 | — |
| safe methods for inducing altered states through breath | ❌ | no safety-framed content |
| breathing practices for self-realization | 🟡 | "self-realization" appears once, not developed |
| difference between conscious connected breathing and holotropic breathwork | ❌ | "conscious connected breathing" — zero hits; a clean, specific future blog title |

### Where the real gaps concentrate

Not 41 scattered problems — three root causes:

1. **No Accreditation page** (Phase F) — accounts for essentially all of category 6 and part of 5.
2. **No Transpersonal Therapist / career page** (Phase D) — accounts for the career-change phrases in
   categories 4 and 5.
3. **"Personal Therapy" (category 2) is a weak fit for a training-school site** — needs a strategy
   decision (lean into it via Become a Practice Client, or accept it's out of scope), not just copy.

Fully missing (❌) phrases, for reference: *expanded states of consciousness for beginners*, *inner
peace*, *find a therapist who uses shamanic and integral methods*, *body-oriented psychotherapy for
emotional release*, *transpersonal counseling for existential depression*, *integration therapy for
psychedelic or breathwork experiences*, *career change to transpersonal counseling therapist*,
*european transpersonal association certification requirements*, *psychotherapy certification valid in
europe transpersonal field*, *safe methods for inducing altered states through breath*, *difference
between conscious connected breathing and holotropic breathwork*.

---

### Open decision — the `/training-overview/` URL

WEBSITE_CONTENT.md proposes `URL: /holistic_Therapy_for_self_development` ("this is good for seo").
The instinct is right — `/training-overview/` contains no keyword — but the proposed form uses
underscores and capitals, against URL conventions. The site is not live yet, so a change is cheap; it
would need the matching row in [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md) updated.
**Not changed** pending a decision between keeping `/training-overview/` and moving to
`/transpersonal-psychotherapy-training/` → [TODO task 41](TODO.md#task-41).

---

<a id="factual-conflicts"></a>

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

Six further problems in the doc — dead WordPress links, a duplicate contact address, an "EURTOS"
typo, and three unresolved authoring notes — are listed with the fee rows in
**[TODO task 43](TODO.md#task-43)**.

Nothing in `WEBSITE_CONTENT.md` should be published as copy until the fee rows agree with
`training-overview.html`.
