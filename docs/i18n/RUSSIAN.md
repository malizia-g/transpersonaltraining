# Russian version — review guide

Branch `multi-language`. The goal is **visibility in Russian-language search** (Yandex and
Google), not a complete copy of the site. Only the pages that carry search demand are
translated; everything else stays in English and is marked "EN" in the Russian menu.

## What to review

| Russian page | English original | Text to edit |
|---|---|---|
| `/ru/` | `/` | [src/ru/index.html](../../src/ru/index.html), [src/content/ru/home/](../../src/content/ru/home/) |
| `/ru/obuchenie-transpersonalnoy-psihoterapii/` | `/training-overview/` | [src/ru/obuchenie-transpersonalnoy-psihoterapii.html](../../src/ru/obuchenie-transpersonalnoy-psihoterapii.html), [src/content/ru/training-overview/](../../src/content/ru/training-overview/) |
| `/ru/chto-takoe-transpersonalnaya-psihologiya/` | `/what-is-transpersonal-psychology/` | [src/ru/chto-takoe-transpersonalnaya-psihologiya.html](../../src/ru/chto-takoe-transpersonalnaya-psihologiya.html), [src/content/ru/what-is-transpersonal-psychology/](../../src/content/ru/what-is-transpersonal-psychology/) |
| `/ru/holotropnoe-dyhanie/` | `/techniques/` | [src/ru/holotropnoe-dyhanie.html](../../src/ru/holotropnoe-dyhanie.html), [src/content/ru/techniques/](../../src/content/ru/techniques/) |

Shared text (menu, footer, privacy policy, page titles in search results, contact-form
messages):

- Menu labels: [src/_data/navigation.js](../../src/_data/navigation.js)
- Footer, structured data, small labels: [src/_data/i18n.js](../../src/_data/i18n.js)
- Privacy policy: [src/_includes/privacy/ru.njk](../../src/_includes/privacy/ru.njk)
- Photo descriptions on the home page: [src/_data/filmstrip.js](../../src/_data/filmstrip.js)
- Contact-form messages: [src/scripts/pages/contact.js](../../src/scripts/pages/contact.js)
- `title` and `description` at the top of each page file are what Yandex and Google show
  in the results. They matter most for SEO; please read them first.

Reviewers who prefer not to touch files can comment on the built pages instead.

## Keyword choices

Each page targets one main query. The wording in the title, the H1 and the URL is chosen
for that query, so please keep these phrases when you edit, or tell us if a better one exists.

| Page | Main query | Supporting terms used |
|---|---|---|
| Home | обучение трансперсональной психотерапии | холотропное дыхание, психологическое консультирование, EUROTAS, интенсивы на русском |
| Training | обучение трансперсональной психотерапии / психологии | уровни, стоимость, сертификат, супервизия |
| What is | трансперсональная психология (что это) | Гроф, Маслоу, необычные / изменённые состояния сознания |
| Holotropic | холотропное дыхание | по Грофу, ситтер, сеанс, БПМ (базовые перинатальные матрицы), семейные расстановки, треугольник Карпмана, работа с тенью, внутренний ребёнок |

Glossary used throughout (please flag anything that sounds wrong to a Russian-speaking
practitioner):

| English | Russian |
|---|---|
| Holotropic Breathing / Breathwork | холотропное дыхание |
| breather / sitter / facilitator | дышащий / ситтер / фасилитатор |
| non-ordinary states of consciousness | необычные (холотропные) состояния сознания |
| altered states of consciousness | изменённые состояния сознания |
| counselling | психологическое консультирование |
| peer group | интервизионная группа |
| intensive (residential) | (выездной) интенсив |
| Western / Eastern track | Западное / Восточное направление |
| co-regulation | совместная регуляция |
| family constellations | семейные расстановки |
| Drama Triangle | драматический треугольник Карпмана |
| Basic Perinatal Matrices | базовые перинатальные матрицы (БПМ) |
| Process Work | процессуальная работа |
| The Body Keeps the Score | «Тело помнит всё» |

"Holotropic Breathwork" is a registered trademark (of Grof Transpersonal Training, not
copyright). The English site already uses "Holotropic Breathing", and the Russian
"холотропное дыхание" is the generic phrase people search for, so that is what we use.

## Where the Russian differs from the English on purpose

- **What is transpersonal psychology:** one paragraph added on the history of the field
  (late 1960s, the "fourth force", Maslow and Grof), with a link to the holotropic page. Russian
  searches for this topic are mostly "what is it / who founded it"; the English page doesn't
  answer that.
- **Holotropic page:** one paragraph added (≈40 sessions over four years, alternating as
  breather and sitter, then facilitating under supervision; contraindications, which we ask
  about in confidence). It comes from the training's own requirements and the enrolment
  agreement. It answers what people searching "холотропное дыхание" want to know.
- **Psychedelic studies — left out of the Russian page.** Russian law (Federal Law 3-FZ,
  art. 46) prohibits content that could be read as promoting narcotic drugs, and sites are
  blocked for it. The English block ("harm reduction", "therapeutic renaissance of
  psychedelics") is a real risk of the whole domain being blocked in Russia, which is the
  opposite of what this work is for. For the same reason, the quotation on the What-is page
  drops its clause about psychedelics, marked with […]. **Please confirm or overrule.**
- **Home and training:** the fact that the Eastern track's intensives are **in Russian** is
  stated in the hero and the description. It is the strongest reason for a Russian speaker to
  choose this school and was not prominent in English.
- **Contact form:** the Russian page preselects "Eastern office"; the form also tells the office
  which language the person wrote from (`lang: "ru"`), so the reply can be in Russian. The
  Apps Script that receives the form ignores the field until someone uses it.
- **"Postgraduate programme" / "degree":** rendered as "профессиональная программа
  обучения". "Дополнительное профессиональное образование (ДПО)" and "диплом" are
  regulated terms in Russia and would promise something the school does not issue.

## Open questions for the reviewers

1. **Teachers' names** are left in Latin script (Rainer Pervoltz, Stefan Dressler, Jure
   Biechonski, Lyudmila Skartsesku) because we don't know the spelling they use in Russian.
   If they have an established Cyrillic form, use it — it helps search.
2. *ponya* and *anoya* (spectrum of love) are kept in Latin: we couldn't find the source term.
3. "The Central" is rendered «Центральное». Is there an established Russian name in the
   school's Eastern programme?
4. Is the monthly Zoom call held in Russian too? If so, the home page should say so.
5. Fees, levels, hours: copied as they are in English. Please double-check the figures
   for the Eastern track.

## Not translated (yet)

Curriculum, teachers, schedules, venues, practice clients, reading list, collaborations,
blog, apply, legal notice. Next candidates, in order of search value:

1. **Teachers** — the old site's teacher pages had real Russian traffic (e.g. «Владимир Майков»).
2. **Intensive schedule** — "семинар холотропного дыхания" + dates; the event rows come from
   the Google Sheet, so it needs a Russian column there first.
3. **Become a practice client** — "сеанс холотропного дыхания" / "трансперсональный психолог онлайн".

## How it works (for whoever maintains the site)

- A Russian page lives in `src/ru/` and names its English page in its front matter:
  `translationOf: /training-overview/`. That single line produces the hreflang tags,
  the language switcher, the automatic redirect and the menu links. A wrong URL fails the build.
- A page asks for its text with `'training-overview/01-philosophy.md' | pageContent(lang)` and
  gets `src/content/ru/training-overview/01-philosophy.md` when it exists.
- **Automatic language:** a first-time visitor whose browser's main language is Russian,
  landing on an English page that has a Russian version, is sent to it. Once they pick a
  language with the RU/EN switch, that choice wins. Crawlers are never redirected, so
  Google and Yandex index both versions.
- Cyrillic fonts are self-hosted (`src/assets/fonts/*-cyrillic.woff2`) and only download on
  pages that contain Cyrillic text.
- `scripts/i18n/translate.js` (the old DeepL whole-site machine translation, not part of the
  build) writes to the same `/ru/` paths. Don't run it on this branch.

## After launch

- Add the site to **Yandex Webmaster** (webmaster.yandex.ru) and submit the sitemap: Yandex
  has roughly two thirds of search in Russia, and Google Search Console doesn't report it.
- Check the Russian queries in both after 4–6 weeks; adjust titles accordingly.
