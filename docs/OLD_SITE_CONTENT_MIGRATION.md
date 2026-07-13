# Old Site → New Site: Content Gap Analysis & Migration Plan

> What the old WordPress site (transpersonal-training.com) contains that the new Eleventy site
> does not — verified page by page in July 2026 — plus where each piece of information should
> live on the new site and why (SEO + conversion rationale).
>
> Companion documents: [MARKETING_AND_SEO.md](MARKETING_AND_SEO.md) (overall roadmap — phases
> referenced below are its phases), [PABLO_TASKS.md](PABLO_TASKS.md) (launch blockers).

*Created: July 2026*

---

## How to read this document

A previous review flagged a list of "missing content" by comparing the old site to the new one.
This analysis re-verified every item against both the old site and the new codebase. Several
items turned out to be **deliberate restructurings, not omissions** — those are marked as such
so nobody "fixes" them backwards. The rest are genuine gaps with a target page each.

Key structural facts established:

- The old **4-stage / 13-module** curriculum has been intentionally replaced by a **3-level /
  15-module** curriculum (L1 Self-Development: 4 modules · L2 Counselling Skills: 6 modules ·
  L3 Psychotherapy & Holotropic Breathwork Practitioner: 5 modules incl. a 580-hour external
  placement), sourced from the Curriculum spreadsheet (PABLO task 3, still to finalize).
  **Do not port the old Stage I–IV structure.**
- The **old East Program cohort (2021–2025) is concluded** (final exam 30.05.2025) — but East
  is **not** retired for 2027–2030. Confirmed structure: East and West run as one integrated
  online programme (same online lessons, same people, West anglophone / East with Russian
  translation), while **in-person intensives are held separately** per track. This means the
  new site's current "West-only" framing is **incomplete, not just missing East history** — see
  §1.0.
- The new Teachers page shows 12 people (6 core + 6 guest); the old homepage lists 32. PABLO
  task 6 says the public page should be **core teachers only** — so the direction is *fewer*
  teachers, not more. The open question is the final roster, not migrating 30 bios.

---

## Questions for Pablo

Answer inline below each question (replace the blank after "**Answer:**"), then hand the file
back — every answer here unblocks a specific action elsewhere in this document, so once these
are filled in the actual content/code updates can be executed directly. Grouped by the section
they unblock. When in doubt, over-answer rather than skip — a "not sure, ask X" is still useful
signal.

### A. East/West integrated structure (unblocks §1.0)

1. Where is the Eastern in-person venue (city/country)? Is it one fixed venue like Todtmoos/Monteverdi, or does it rotate?
   **Answer: The Eastern venue has to be decided, so add a section on the website wich prepare for the Eastern venue... but write coming soon ...**
2. Is the Eastern intensive schedule for 2027–2030 finalized and ready to publish on `/schedule/`, or still TBD?
   **Answer: The page schedule is updated by a spreadsheet, so don't care about this**
3. Confirm the language split is unchanged from the old site — West delivered in English (with translation for non-English speakers), East delivered with Russian translation (or vice versa). Anything different for 2027–2030?
   **Answer: Online lessons are in english (with automatic translation for russians) in presence seminars will be in english for west and russian for east. There might be seminars for both sides of the school and there we will provide translations**
4. Is there one shared `/apply/` form with a track selector (East/West), or two separate application flows?
   **Answer: I would add a choose for the user. Apply for west or apply for east**
5. Can an Eastern-track student attend a Western intensive (Todtmoos/Monteverdi) instead of or in addition to the Eastern one, or are the two tracks strictly separate?
   **Answer: No they are not strictly separated, he should pay for the extra seminar or agree with us if it is a recovery**
6. Should the site actively target Russian-speaking searchers (a Russian-language page, or at least explicit "with Russian translation" copy), or keep marketing English-only and just describe the East option briefly? (Also relevant to Q42.)
   **Answer: at the moment only english, they will translate with google translate, may be some page will be in russian but not for the moment**

### B. Certificates per level (unblocks §1.1)

7. What is awarded at the end of **Level 1** (Self-Development)? Same "certificate of attendance" as the old Stage I, or something else?
   **Answer: Yes, the Level 1 is called self development (the fact that you can join only for self development must be also mentioned in the home page) and we will give a cert of attendance**
8. What is awarded at the end of **Level 2** (Counselling Skills)? A EUROTAS-accredited institute certificate + credits, as under the old Stage II?
   **Answer: yes**
9. What is awarded at the end of **Level 3** (Psychotherapy & Holotropic Breathwork Practitioner)? Full EUROTAS-track certification built in, or an optional add-on like the old Stage IV?
   **Answer: Psychotherapy & Holotropib Breathwork facilitator, add a note that Psychotherapist is a restricted name in some countries (like in italy), so advise people that we are tryng to be  EAP complient, but is not up to as at the moment there are not transpersonal schools accepted bi EAP. So people have to check their country regulation about psychotherapy **
10. Is there an exact official certificate title/wording to use verbatim (for page copy and for the `educationalCredentialAwarded` schema field)?
    **Answer: no. is it important?**

### C. Enrollment options (unblocks §1.2)

11. Do all four old enrollment paths still apply to the new 3-level/15-module structure: (a) full EUROTAS path, (b) psychology-degree holders skipping mainstream-psychology content, (c) certificate-only track, (d) single recorded lectures at a per-lecture price?
    **Answer: no**
12. If a "certificate-only" path still exists, which level(s) does it cover — L1 only, or L1+L2?
    **Answer: only L1**
13. Is the single-lecture purchase option (previously €40) still offered for 2027–2030?
    **Answer: yes, also single seminar option**
14. Are enrollment options identical for the East and West tracks, or do they differ?
    **Answer: identical**

### D. Fees (unblocks §1.3)

15. What is the 2027–2030 per-module price (now 15 modules instead of 13)?
    **Answer: 489 east | 689 west**
16. What is the full-programme price?
    **Answer: not relevant**
17. Is the single-lecture price still relevant, and if so, what is it?
    **Answer: 45€**
18. Should the site publish exact prices, a "starting from" figure, or a range? (Ties to Marketing plan open decision #5.)
    **Answer: publish the exact price, but add that we can provide discounts if people have money problem (they need to write us) and we provides free modules if people brings other people (one free module for each new student)**
19. Are prices identical for East and West tracks, or do they differ?
    **Answer: they differs as written before**
20. Keep Stripe as the payment processor for the new site, or something else?
    **Answer: no, we have to decide, for the moment you cannot pay from this website**

### E. Direct contacts (unblocks §1.4)

21. Is the Western phone number `+49 176 38034517` still current?
    **Answer: yes**
22. Is the Eastern phone number `+373 79024199` still current and still relevant now that the East track is confirmed live?
    **Answer: yes**
23. Is the Facebook page "Eastwest Transpersonal Training School" still actively maintained? Should it be linked from the new site?
    **Answer: yes, also add Instagram and substack (still to be created, add to the pablo's tasks)**
24. Would a WhatsApp/Telegram contact be worth adding, particularly for Eastern/Russian-speaking applicants (Telegram is widely used there)?
    **Answer: yes, add to the pablo's tasks**

### F. EUROTAS accreditation (unblocks §2.5)

25. Can you provide a current, working link to the official EUROTAS "General Criteria for ESTP Certification" PDF (the old URL may be stale)?
    **Answer: look on the web on EUROTAS website and update the url in case**
26. Is the school's EUROTAS "Organizational TREE member" status still accurate, or has it changed/upgraded since the old site was written?
    **Answer: The status is still accurate**
27. The old site required 8–10 Holotropic Breathwork sessions/year; the new site's Commitment section says "40 sessions in 4 years" (~10/year average). Since the new levels have uneven durations (L1 = 1yr, L2 = 1.5yr, L3 = 1.5yr), should the requirement be stated as a flat "~10/year" or scaled per level length?
    **Answer: scaled per level lenght**

### G. Legal identity (unblocks §2.6)

28. What is the exact legal entity operating the school today — the German "Eastwest Transpersonal Training School," the Moldovan "Association of Transpersonal Development," both jointly, or something else/updated?
    **Answer: TO_BE defined, add to pablo's tasks. for the moment use the old website info's**
29. What is the correct registered name, city/country, and any registration number to publish as the GDPR data controller in the privacy policy?
    **Answer: TO_BE defined, add to pablo's task**
30. Does the confirmed Eastern in-person venue (see A.1) mean the Moldovan (or another Eastern) entity should be named as co-operator on the site?
    **Answer: The entity will be one, so do not mention other entities**

### H. Cooperation partners (unblocks §2.7)

31. Please confirm which of these 7 partnerships are still active, so only current ones get published:
    - International Institute for Consciousness Exploration & Psychotherapy — Freiburg, Germany — **Active? Answer:**
    - Transpersonal Psychotherapy School — Milan, Italy — **Active? Answer:**
    - Integral Transpersonal Institute — Milan, Italy — **Active? Answer:**
    - Inner Arts Institute — Watertown, MA, USA — **Active? Answer:**
    - School of Transpersonal Psychology and Hypnotherapy "Teadlik Mina" — Estonia — **Active? Answer:**
    - Latvian Transpersonal Education Institute — Latvia — **Active? Answer:**
    - Holos Transpersonal Training School — Romania — **Active? Answer:  we need to check that they backlink our school, add to PABLO's tasks**
    - 
32. Are there any new partner institutes (not on the old list) that should be added?
    **Answer: add to pablo's**

### I. East programme history (unblocks §2.8)

33. What year was the school actually founded — is 2021 (the start of the East cohort) the founding year, or does the school's history go back further?
    **Answer: yes 2021**
34. Do you want to write the "Our history" paragraph yourself, or should a draft be prepared for your review?
    **Answer: draft it**
35. Who should own setting up the 301 redirects for the old East URLs (`/program/`, `/archive-*`) — is this a Pablo/technical task, or does it depend on the hosting decision in the Marketing plan (open decision #4)?
    **Answer: add to pablo's task**

### J. Faculty (unblocks §2.9)

36. `coreTeachers.json` already lists Lyudmila Skartsesku as "Head East" and Kati Wortelkamp as "Head West," and the Teachers page hero already reads "bringing East and West together in transpersonal knowledge" — was this intentional foresight? Should the East/West leadership split be made more visible on the page now that the Eastern track for 2027–2030 is confirmed?
    **Answer: yes kati is the Head West and Lyudmila is the East**
37. What is the final core-teacher roster for the public Teachers page — does it change at all now that the East track is confirmed live (e.g. any additional Eastern faculty to add as core)?
    **Answer: Don't worry about this**
38. Which guest/visiting faculty names (from the ~20 on the old site not currently listed) should appear in a names-only "has also taught with us" block, if any?
    **Answer: Can you list on marketing plan all those faculties and collaborations, so I check they backlink us?**
39. Confirm Maria Kühl-Weigmann (deceased 2023) should not be listed as active faculty anywhere — she is not currently in the 12-person Teachers list; should that stay the case?
    **Answer: no**

### K. Lower priority (unblocks §3)

40. Newsletter: keep the existing CleverReach platform and subscriber list, or migrate to Brevo as the Marketing plan currently recommends?
    **Answer: I would migrate to Brevo**
41. Reading-list / video-resources page: worth building as a public page? Is the old site's book/video list still your preferred selection, or should it be refreshed?
    **Answer: build a the page, add some of the old videos, but we will refresh. Add to Marjeting plan**
42. Should the site stay English-only for now (Marketing plan open decision #8), or does the confirmed Eastern track change that calculus? (See also A.6.)
    **Answer: English only**

---

## 1. Genuine gaps — high priority (block or weaken conversion)

### 1.0 East/West integrated structure for 2027–2030 (new — corrects published copy)

**Confirmed structure (Fabio, 2026-07-13):** the 2027–2030 programme is **not** West-only.
East and West are integrated online — same lessons, same cohort, taught together — with West
delivered in English and East with Russian translation (consistent with the old site's
"Training West: English… / Training East: English with Russian Translation or vice versa").
**In-person intensives, however, are held separately** per track — i.e. there is an Eastern
in-person venue/location distinct from the two Western European venues.

**Problem:** several already-published pages state or imply a West-only, Western-Europe-only
offer. These are not silent gaps, they are **statements that need to be corrected**:

- [index.html:49](../src/index.html#L49) hero subhead — "online lectures, in-person intensives
  across Western Europe."
- [index.html:81](../src/index.html#L81) fact strip — "In-person intensives / across Western
  Europe."
- [src/_data/seo.js:3](../src/_data/seo.js#L3) — global site description — "EUROTAS-accredited
  online programme with in-person intensives in Western Europe."
- [venues.html](../src/venues.html) — entire page framed as "two venues" (Todtmoos, Germany +
  Tenuta di Monteverdi, Tuscany), both intro copy and meta description ("The two in-person
  venues for our transpersonal training intensives…"). If an Eastern venue exists, this page
  is currently incomplete, not just silent.
- [training-overview.html](../src/training-overview.html) hero image/copy doesn't name a
  region directly but inherits the same West-only assumption from the homepage.

**Action (blocked on open decision #17 below):**
1. Confirm the Eastern in-person venue(s)/location(s), language logistics, and whether the
   Eastern track has a separate schedule of intensives (feeds `/schedule/`, which currently
   only shows Western dates via the Sheets feed).
2. Rewrite the homepage hero/fact-strip and `seo.js` description to state "online lectures for
   one integrated East–West cohort; in-person intensives held separately in Western Europe and
   [Eastern location]."
3. Expand Venues from "two venues" to "our venues" with an Eastern section added, mirroring the
   Todtmoos/Monteverdi structure (photos pending — likely a new shot-list gap, see
   `photo_updating` branch notes).
4. Curriculum/Training Overview should clarify that the *online* curriculum is shared across
   both tracks and only the *residential* component diverges.

**SEO:** this substantially widens the addressable audience (Russian-language / Eastern Europe
searches) beyond the "English-language searches from Europe" primary target currently stated
in MARKETING_AND_SEO.md §2 — worth a note there once the venue/logistics are confirmed, and
worth reconsidering whether a Russian-language landing page or hreflang variant belongs in
Phase D/Open Decision #8 (currently "English-only until the cohort fills").

### 1.1 Certification outcomes per level

**Old site:** each stage states its concrete output — Stage I: certificate of attendance;
Stage II: Counseling Skills certification from a EUROTAS-accredited institute + credits;
Stage III: Transpersonal Counseling & foundations of Breathwork; Stage IV: full certification
in Transpersonal Psychotherapy, Counseling Skills and Breathwork Therapy + EUROTAS option.

**New site:** the Curriculum page lists levels/modules with no certificate attached to any
level; Training Overview documents School Track vs EUROTAS Track supervision hours but never
says *what you hold in your hand* after each level.

**Action:** define the certificate earned at the end of each of the 3 new levels (needs
Fabio/faculty sign-off — the old stage outputs do not map 1:1 onto the new levels) and show it:

- **Curriculum page** — a "What you earn" line inside each level card (L1, L2, L3).
- **Training Overview** — a compact 3-row summary table (Level → Duration → Certificate),
  next to the existing "Duration by Level" card.

**SEO:** "certification" / "certified transpersonal…" are core modifiers in the keyword sheet;
certificates are also the #1 pre-application question. Rich snippet potential once the
`Course` JSON-LD gets `educationalCredentialAwarded`.

### 1.2 Enrollment options

**Old site (/program-2026/):** four clear paths — (1) full EUROTAS certification track
(requires higher degree); (2) psychology-degree holders skip mainstream-psychology lectures;
(3) certificate-only (old modules 1–8); (4) single recorded lectures at €40 each.

**New site:** nothing equivalent; the admissions cards describe *requirements* per level but
not *what you can buy*.

**Action:** redefine the enrollment options against the new 3-level structure (candidate
mapping to confirm: L1 only = self-development year → L1+L2 = counselling track → full
programme = psychotherapy track → single lectures à la carte), then publish on:

- **/apply/ page** (planned in Phase A2) — the full options with requirements and fees.
- **Training Overview** — one short paragraph + link to /apply/.

**SEO/conversion:** this is the single biggest "what am I buying" clarifier; it also matches
the per-persona landing logic in the keyword map (counsellor vs psychotherapist vs
personal-growth entry points).

### 1.3 Fees

**Old site:** €579 per module (≈3 months) · €6,948 full 13-module programme · €40 per single
lecture · pay-per-module flexibility, Stripe checkout on /payment/.

**New site:** no prices anywhere.

**Action:** confirm 2027–2030 cohort pricing (old prices belong to the old 13-module
structure — do not copy them as-is), then:

- **/apply/** (or a dedicated /fees/ section on it): per-module price, full-programme price,
  what's included, payment flexibility, single-lecture price if kept.
- **Homepage `Course` JSON-LD:** add `offers` (price, priceCurrency EUR) once public.

This is MARKETING open decision #5 — recommendation there stands: publish at least a range.
**SEO:** "…training cost/fees" queries are high-intent; competitors hiding fees lose
applicants (already argued in Phase A2).

### 1.4 Direct contacts

**Old site:** Western Head Office +49 176 38034517 · Eastern Head Office +373 79024199 ·
Facebook "Eastwest Transpersonal Training School" · office@transpersonal-training.com.

**New site:** email only.

**Action:** add the Western phone (and Facebook, if the page will stay maintained) to the
footer Connect column and the homepage #contact section; add `contactPoint` (+ `telephone`)
and `sameAs` (Facebook) to the Organization JSON-LD. Decide whether the Eastern number is
still relevant for a West-only offer — likely footer-level only or dropped.

**Trust:** a school asking for a 4-year commitment with no phone number reads as a red flag
to exactly the demographic (40+, career changers) most likely to enrol.

---

## 2. Genuine gaps — medium priority (trust, E-E-A-T, link equity)

### 2.5 EUROTAS certification requirements in detail

**Old site:** links the official PDF "General Criteria for ESTP Certification"; states the
mandatory **8–10 Holotropic Breathwork sessions per year** with certified practitioners.

**New site:** the Commitment section's "40 sessions of Holotropic Breathwork practice" over
4 years is consistent (~10/year) — the *content* survived, the *authority link* didn't.

**Action:** the planned **Accreditation page** (Phase F) hosts: what EUROTAS/TREE membership
means, the certification criteria with a link to the official EUROTAS PDF, the School Track
vs EUROTAS Track comparison (already drafted in training-overview content), and the yearly
breathwork requirement stated explicitly.

**SEO:** this page targets `eurotas accredited psychotherapy schools` and
`transpersonal psychology degree europe` (both low difficulty, already flagged unassigned
in Phase D1). The outbound link to eurotas.world supports the reciprocal listing ask (Phase H).

### 2.6 Responsible organizations (legal identity)

**Old site:** "Association of Transpersonal Development, Republic of Moldova (Head East)" and
"Eastwest Transpersonal Training School, Germany (Head West)".

**New site:** just "Transpersonal Training" — including in the privacy modal, where the GDPR
data controller is currently anonymous ("Transpersonal Training, reachable at the email
address above"). **That is a legal gap, not only a content gap.**

**Action:**
- Footer About column: one line naming the operating organization(s) with country.
- Privacy modal: name the actual legal entity as data controller (+ city/country).
- Accreditation/About content: a short "Who runs the school" paragraph.

Decide whether the Moldovan association still co-operates the West-only offer or the German
entity is now sole operator — copy differs accordingly.

### 2.7 Cooperation partners / institutional network

**Old site lists 7 partner institutes:**

1. International Institute for Consciousness Exploration & Psychotherapy — Freiburg, Germany
2. Transpersonal Psychotherapy School — Milan, Italy
3. Integral Transpersonal Institute — Milan, Italy
4. Inner Arts Institute — Watertown, MA, USA
5. School of Transpersonal Psychology and Hypnotherapy "Teadlik Mina" — Estonia
6. Latvian Transpersonal Education Institute — Latvia
7. Holos Transpersonal Training School — Romania

**Action:** "Partners & Network" section on the Accreditation page (logo/name/city + link).
Verify each partnership is still current before publishing.

**SEO:** each partner is a realistic reciprocal-backlink target (Phase H) — publishing the
list first makes the ask natural.

### 2.8 East Program legacy (redirects + history — plus the 2027–2030 East track, see §1.0)

The *old* East cohort (2021–2025) is finished as a specific enrollment; nothing to "restore"
there. But note this is separate from §1.0: East itself continues for 2027–2030, integrated
online with West. Two distinct things to handle:

1. **Old East cohort URLs** (`/program/`, `/archive-2021/`…`/archive-2025/`, Russian-language
   event pages) are indexed and may hold backlinks, but describe a *finished* enrollment window.
   - Add to the Phase B redirect map: `/program/` → the new integrated-programme page (or the
     history piece below); `/archive-*` → `/schedule/` or homepage.
   - Publish one short "Our history" piece (About section or blog post): school founded around
     the East programme 2021–2025, West programme 2024–2027, new **integrated East–West**
     cohort 2027–2030. Converts "is this school new?" doubt into experience proof.
2. **The live 2027–2030 East track** is not legacy at all — it needs the same treatment as West:
   own line in enrollment options (§1.2), own venue entry (§1.0), language logistics stated
   wherever the West-only assumption currently appears.

### 2.9 Faculty breadth (guest/visiting teachers)

Per PABLO task 6 the public Teachers page becomes core-only. To keep the E-E-A-T and
name-search value of the wider faculty without maintaining 30 bios:

**Action (pending Fabio's roster decision):** a compact text block at the bottom of the
Teachers page — "Guest and visiting faculty over the years have included: …" — names only,
no photos/bios, limited to teachers actually relevant to the West programme. Do **not**
migrate East-only teachers wholesale; note that Maria Kühl-Weigmann is deceased (2023) and
should not be listed as active faculty anywhere.

---

## 3. Low priority / case-by-case

| Old-site item | Verdict | Notes |
|---|---|---|
| **Newsletter archive** (monthly PDFs, Jan 2024 – Jun 2026, via **CleverReach**) | Don't migrate the archive. **But: the school already has a live newsletter platform and subscriber list on CleverReach.** | ⚠️ This affects Phase I, which recommended Brevo assuming zero email infrastructure. Either adopt CleverReach for the new site's forms, or plan a subscriber-list export/import (double-opt-in implications). Fold into open decision #1. |
| **Student area / login, /payment/ (Stripe)** | Already tracked | PABLO task 5 + MARKETING open decision #3 (portal fate). The Stripe payment flows live in the portal decision, not in the public site. |
| **Reading lists & video resources** (/information/: 10-category book list; Grof, Campbell, Mindell videos) | Optional, cheap E-E-A-T win | Could become a public "Resources / Recommended reading" page or 1–2 blog posts. Long-tail SEO (book/author queries), zero writing cost — content exists. P2. |
| **Grof® / Holotropic Breathwork® trademark marks** | Small copy fix | Old site uses ® consistently. Add ® at first mention per page (or one site-wide footnote). Signals legitimacy to informed searchers and respects the trademark. |
| **10-language machine translation widget** | Don't migrate | Stays consistent with open decision #8 (English-only until the cohort fills). |
| **Mission statement** ("Educating therapists for a revolution of consciousness") | ✅ Already migrated | Hero + footer of new site. |
| **8–10 breathwork sessions/year** | ✅ Substantively migrated | As "40 sessions" in Commitment; Accreditation page will restate it per-year (see 2.5). |

---

## 4. Where each piece lands — summary map

| Content | Target page (new site) | Exists? | Phase |
|---|---|---|---|
| East–West integrated structure (online joint, in-person split) | Homepage hero/fact-strip, seo.js, Venues (add Eastern venue), Training Overview | **existing copy needs correcting**, not just adding | A/D |
| Certificates per level | Curriculum (per-level) + Training Overview (table) | pages exist, section new | A/D |
| Enrollment options (redefined for 3 levels) | **/apply/** + Training Overview teaser | /apply/ to build | A2 |
| Fees | **/apply/** (+ JSON-LD `offers`) | to build | A2/D3 |
| Phone + Facebook | Footer, #contact, Organization JSON-LD | edit | A |
| EUROTAS criteria + official PDF link | **/accreditation/** | to build | F |
| Partner institutes (7) | /accreditation/ "Partners & Network" | to build | F/H |
| Legal entities / data controller | Footer + privacy modal + /accreditation/ | edit | E/F |
| East programme history | About/history blurb or blog post + 301s | to write | B/G |
| Guest faculty names (curated) | Teachers page footer block | edit | F |
| Reading lists / videos | /resources/ or blog posts | optional | G |
| Newsletter (CleverReach!) | Phase I platform decision | decision | I |
| Payment / portal | Portal decision | decision | B2 |

## 5. Decisions this adds for Fabio

Superseded by **[Questions for Pablo](#questions-for-pablo)** above, which expands these into
42 concrete, answerable questions grouped by the section they unblock. Answer there; this list
stays only as a short index into that section:

10. Certificates per level → Questions B (7–10)
11. Enrollment options 2027–2030 → Questions C (11–14)
12. New cohort pricing → Questions D (15–20)
13. Legal identity on the new site → Questions G (28–30)
14. Which partnerships are still active → Question H (31–32)
15. CleverReach vs Brevo → Question K (40)
16. Guest-faculty name list → Questions J (37–39)
17. Eastern in-person venue(s) for 2027–2030 → Questions A (1–6)

---

*Last updated: July 2026*
