const https = require('https');
const fs = require('fs');
const path = require('path');

// The stable /exec web-app URL. It survives redeployments, unlike the
// googleusercontent /macros/echo URL it redirects to, whose user_content_key is
// minted per deployment — pinning the build to one of those silently freezes the
// site on an old version of the Apps Script.
const CURRICULUM_JSON_URL = 'https://script.google.com/macros/s/AKfycbxCzM30igQdGt2vYsRaQToDtKnjvIE5ZIypoKSaxoBtrXlajcEBc1NArDxmbXzNqCzhOA/exec';
const CACHE_FILE = path.join(__dirname, 'curriculumData.cache.json');

function fetchUrl(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Eleventy-Static-Site-Generator',
          Accept: 'application/json,text/plain,*/*'
        },
        timeout: 30000
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectsLeft <= 0) {
            reject(new Error('Too many redirects while fetching curriculum data'));
            return;
          }
          fetchUrl(res.headers.location, redirectsLeft - 1).then(resolve).catch(reject);
          return;
        }

        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const trimmed = body.trim();
          if (!trimmed) {
            reject(new Error('Empty response from curriculum endpoint'));
            return;
          }

          if (trimmed.startsWith('<')) {
            reject(new Error('Curriculum endpoint returned HTML instead of JSON'));
            return;
          }

          try {
            resolve(JSON.parse(trimmed));
          } catch (error) {
            reject(new Error(`Failed to parse curriculum JSON: ${error.message}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Curriculum request timed out'));
    });
  });
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/* ── "Show on website" column ──────────────────────────────────────────────
   The curriculum spreadsheet carries a visibility flag per row. It is read
   here rather than in the template so a hidden row never reaches the page,
   the cache, or the module counters. Only an explicit "false" hides a row:
   a blank cell (or a row the export doesn't carry the column for) stays
   visible, so content is never dropped silently. */
const VISIBILITY_KEYS = [
  'showonwebsite',
  'showonsite',
  'showonweb',
  'showwebsite',
  'website',
  'visible',
  'published',
  'publish',
  'show'
];

const HIDDEN_VALUES = new Set(['false', 'no', 'n', '0', 'off', 'hide', 'hidden', 'nascondi', 'nascosto']);

let hiddenRowCount = 0;

function normalizeKeyName(key) {
  return String(key).toLowerCase().replace(/[^a-z]/g, '');
}

function isVisibleOnWebsite(raw) {
  if (!raw || typeof raw !== 'object') {
    return true;
  }

  for (const key of Object.keys(raw)) {
    if (!VISIBILITY_KEYS.includes(normalizeKeyName(key))) {
      continue;
    }

    const value = raw[key];
    const isHidden =
      value === false ||
      value === 0 ||
      (typeof value === 'string' && HIDDEN_VALUES.has(value.trim().toLowerCase()));

    if (isHidden) {
      hiddenRowCount += 1;
      return false;
    }
  }

  return true;
}

function cleanText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function pickFirstString(obj, keys) {
  for (const key of keys) {
    const value = cleanText(obj?.[key]);
    if (value) {
      return value;
    }
  }
  return '';
}

function normalizeTopicList(rawSub, description) {
  const topicList = []
    .concat(asArray(rawSub?.topics))
    .concat(asArray(rawSub?.items))
    .concat(asArray(rawSub?.points))
    .map(cleanText)
    .filter(Boolean);

  if (topicList.length > 0) {
    return topicList;
  }

  if (!description || !description.includes('\n')) {
    return [];
  }

  return description
    .split(/\r?\n/)
    .map(cleanText)
    .filter(Boolean);
}

function normalizeSubModule(rawSub, index) {
  const topic = pickFirstString(rawSub, ['topic', 'title', 'name', 'module', 'subModule', 'submodule']);
  const description = pickFirstString(rawSub, ['description', 'desc', 'summary', 'content']);
  const topics = normalizeTopicList(rawSub, description);

  if (!topic && !description && topics.length === 0) {
    return null;
  }

  return {
    topic: topic || `Sub-module ${index + 1}`,
    description,
    topics
  };
}

function normalizeModule(rawModule, index) {
  if (!isVisibleOnWebsite(rawModule)) {
    return null;
  }

  const topic = pickFirstString(rawModule, ['topic', 'title', 'name', 'module']);
  const description = pickFirstString(rawModule, ['description', 'desc', 'summary', 'content']);
  const hours = pickFirstString(rawModule, ['hours', 'totalHours', 'moduleHours', 'hour']);
  const deliveryFormat = pickFirstString(rawModule, [
    'deliveryFormat',
    'delivery format',
    'teachingStrategy',
    'teaching strategy',
    'strategy'
  ]);
  const number = pickFirstString(rawModule, ['number', 'moduleNumber', 'module number', 'module', 'id']);

  const rawSubModules = [
    ...asArray(rawModule?.subModules),
    ...asArray(rawModule?.submodules),
    ...asArray(rawModule?.children)
  ];

  // Visibility is resolved before normalizing so a module can tell the page that it
  // *has* a topic breakdown that is simply not published yet — otherwise a module
  // whose sub-modules are all hidden looks identical to one that never had any.
  const visibleRawSubModules = rawSubModules.filter(isVisibleOnWebsite);

  const subModules = visibleRawSubModules
    .map((subModule, subIndex) => normalizeSubModule(subModule, subIndex))
    .filter(Boolean);

  // Read back from the normalized shape too, so the flag survives a cache round-trip
  // (the hidden rows themselves are long gone by then).
  const hasHiddenSubModules =
    rawModule?.hasHiddenSubModules === true || visibleRawSubModules.length < rawSubModules.length;

  if (!topic && !description && !hours && !deliveryFormat && subModules.length === 0) {
    return null;
  }

  return {
    number: number || `${index + 1}`,
    topic: topic || `Module ${index + 1}`,
    description,
    hours,
    deliveryFormat,
    subModules,
    hasHiddenSubModules
  };
}

function sectionLooksLikePractical(section) {
  const sectionTitle = pickFirstString(section, ['title', 'name', 'section', 'label']);
  return /experiential\s*\/?\s*personal\s*\/?\s*group\s*work/i.test(sectionTitle);
}

function sectionLooksLikeExamination(section) {
  const sectionTitle = pickFirstString(section, ['title', 'name', 'section', 'label']);
  return /examin/i.test(sectionTitle);
}

function itemLooksLikeExamination(item) {
  const topic = pickFirstString(item, ['topic', 'title', 'name', 'module']);
  const deliveryFormat = pickFirstString(item, [
    'deliveryFormat',
    'delivery format',
    'teachingStrategy',
    'teaching strategy',
    'strategy'
  ]);

  return /examin/i.test(`${topic} ${deliveryFormat}`);
}

function extractSectionItems(section) {
  if (!isVisibleOnWebsite(section)) {
    return [];
  }

  return []
    .concat(asArray(section?.activities))
    .concat(asArray(section?.items))
    .concat(asArray(section?.modules));
}

function dedupeSupplementaryItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.topic}::${item.deliveryFormat}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function saveCurriculumCache(normalized) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(normalized, null, 2));
    console.log(`✅ Curriculum cache saved (${normalized.levels.length} levels, ${normalized.totalModules} modules)`);
  } catch (cacheError) {
    console.warn('⚠️ Could not save curriculum cache:', cacheError.message);
  }
}

function normalizePracticalItem(item, index) {
  if (!isVisibleOnWebsite(item)) {
    return null;
  }

  const topic = pickFirstString(item, ['topic', 'title', 'name', 'module']);
  const deliveryFormat = pickFirstString(item, [
    'deliveryFormat',
    'delivery format',
    'teachingStrategy',
    'teaching strategy',
    'strategy'
  ]);

  if (!topic && !deliveryFormat) {
    return null;
  }

  return {
    topic: topic || `Experiential item ${index + 1}`,
    deliveryFormat
  };
}

function getItemModuleCode(item) {
  return pickFirstString(item, ['module', 'number', 'moduleNumber', 'module number', 'id']);
}

function getModuleRangeUpperBound(moduleCode) {
  const integerValue = cleanText(moduleCode);
  if (/^\d+$/.test(integerValue)) {
    return Number(integerValue);
  }

  const rangeMatch = integerValue.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    return Number(rangeMatch[2]);
  }

  return null;
}

function itemLooksLikeModuleRecord(item) {
  return /^\d+$/.test(getItemModuleCode(item));
}

function compareModuleNumbers(left, right) {
  const leftValue = getModuleRangeUpperBound(left.number);
  const rightValue = getModuleRangeUpperBound(right.number);

  if (leftValue !== null && rightValue !== null) {
    return leftValue - rightValue;
  }

  return left.number.localeCompare(right.number, undefined, { numeric: true });
}

function extractLevelModules(level) {
  const rawModules = []
    .concat(asArray(level?.modules))
    .concat(asArray(level?.items))
    .concat(asArray(level?.activities))
    .concat(asArray(level?.sections).flatMap(extractSectionItems))
    .filter(itemLooksLikeModuleRecord);

  const seen = new Set();

  return rawModules
    .map((item, index) => normalizeModule({
      ...item,
      number: getItemModuleCode(item)
    }, index))
    .filter(Boolean)
    .filter((module) => {
      const key = `${module.number}::${module.topic}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort(compareModuleNumbers);
}

/* The spreadsheet's Level column has to stay "L1"/"L2"/"L3" — the Apps Script
   groups the rows by matching /^L\d+$/ on it — so the short form is expanded
   here, for the page, rather than at the source. A label that already reads
   "Level 1" passes through untouched. */
function expandLevelLabel(label) {
  const match = /^L\s*(\d+)$/i.exec(label.trim());
  return match ? `Level ${match[1]}` : label;
}

function normalizeSectionedCurriculum(rawLevels) {
  const levels = rawLevels
    .filter(isVisibleOnWebsite)
    .map((level, index) => {
      const practicalItems = extractPracticalItems(level);
      const examinationItems = extractExaminationItems(level);
      const label = expandLevelLabel(pickFirstString(level, ['label', 'level', 'id']) || `Level ${index + 1}`);
      const title = pickFirstString(level, ['title', 'name', 'heading']) || 'Curriculum Level';

      return {
        id: `level${index + 1}`,
        label,
        title,
        modules: extractLevelModules(level),
        practicalItems: dedupeSupplementaryItems(practicalItems),
        examinationItems: dedupeSupplementaryItems(examinationItems)
      };
    })
    .filter((level) => level.modules.length > 0 || level.practicalItems.length > 0 || level.examinationItems.length > 0);

  return {
    levels,
    totalModules: levels.reduce((sum, level) => sum + level.modules.length, 0)
  };
}

function extractPracticalItems(level) {
  const directPractical = asArray(level?.practical)
    .concat(asArray(level?.practicalItems))
    .concat(asArray(level?.experiential));

  const sectionPractical = asArray(level?.sections)
    .filter(sectionLooksLikePractical)
    .flatMap(extractSectionItems);

  return directPractical
    .concat(sectionPractical)
    .filter((item) => !itemLooksLikeModuleRecord(item))
    .filter((item) => !itemLooksLikeExamination(item))
    .map((item, index) => normalizePracticalItem(item, index))
    .filter(Boolean)
    .filter((item) => !itemLooksLikeExamination(item))
    .filter(Boolean);
}

function extractExaminationItems(level) {
  const directExaminations = asArray(level?.examination)
    .concat(asArray(level?.examinations))
    .concat(asArray(level?.examinationItems))
    .concat(asArray(level?.assessments));

  const practicalExaminations = asArray(level?.practical)
    .concat(asArray(level?.practicalItems))
    .concat(asArray(level?.experiential))
    .concat(
      asArray(level?.sections)
        .filter(sectionLooksLikePractical)
        .flatMap(extractSectionItems)
    )
    .filter(itemLooksLikeExamination);

  const sectionExaminations = asArray(level?.sections)
    .filter(sectionLooksLikeExamination)
    .flatMap(extractSectionItems);

  return dedupeSupplementaryItems(
    directExaminations
      .concat(practicalExaminations)
      .concat(sectionExaminations)
      .map((item, index) => normalizePracticalItem(item, index))
      .filter(Boolean)
  );
}

function extractModules(level) {
  const fromLevel = asArray(level?.modules);
  const fromSections = asArray(level?.sections)
    .filter(isVisibleOnWebsite)
    .filter((section) => !sectionLooksLikePractical(section) && !sectionLooksLikeExamination(section))
    .flatMap((section) => []
      .concat(asArray(section?.modules))
      .concat(asArray(section?.items))
    );

  const rawModules = fromLevel.concat(fromSections);

  const seen = new Set();
  return rawModules
    .map((module, index) => normalizeModule(module, index))
    .filter(Boolean)
    .filter((module) => {
      const key = `${module.number}::${module.topic}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function extractLevels(rawData) {
  if (Array.isArray(rawData)) {
    return rawData;
  }

  if (Array.isArray(rawData?.levels)) {
    return rawData.levels;
  }

  if (Array.isArray(rawData?.data?.levels)) {
    return rawData.data.levels;
  }

  if (Array.isArray(rawData?.curriculum?.levels)) {
    return rawData.curriculum.levels;
  }

  return [];
}

function normalizeCurriculum(rawData) {
  const rawLevels = extractLevels(rawData);
  hiddenRowCount = 0;

  if (rawLevels.some((level) => asArray(level?.sections).length > 0)) {
    return normalizeSectionedCurriculum(rawLevels);
  }

  const levels = rawLevels
    .filter(isVisibleOnWebsite)
    .map((level, index) => {
      const modules = extractModules(level);
      const practicalItems = extractPracticalItems(level);
      const examinationItems = extractExaminationItems(level);
      const label = expandLevelLabel(pickFirstString(level, ['label', 'level', 'id']) || `Level ${index + 1}`);
      const title = pickFirstString(level, ['title', 'name', 'heading']) || 'Curriculum Level';

      return {
        id: `level${index + 1}`,
        label,
        title,
        modules,
        practicalItems: dedupeSupplementaryItems(practicalItems),
        examinationItems
      };
    })
    .filter((level) => level.modules.length > 0 || level.practicalItems.length > 0 || level.examinationItems.length > 0);

  const totalModules = levels.reduce((sum, level) => sum + level.modules.length, 0);

  return {
    levels,
    totalModules
  };
}

module.exports = async function () {
  try {
    console.log('Fetching curriculum data from Google Apps Script...');
    const rawData = await fetchUrl(CURRICULUM_JSON_URL);
    const normalized = normalizeCurriculum(rawData);

    if (normalized.levels.length === 0) {
      throw new Error('Curriculum JSON parsed but contains no levels');
    }

    if (hiddenRowCount > 0) {
      console.log(`🙈 ${hiddenRowCount} curriculum row(s) hidden by the "Show on website" column`);
    }

    saveCurriculumCache(normalized);

    return normalized;
  } catch (error) {
    console.error('Error loading curriculum data:', error.message);

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        const normalizedCache = normalizeCurriculum(cached);
        if (Array.isArray(normalizedCache?.levels) && normalizedCache.levels.length > 0) {
          saveCurriculumCache(normalizedCache);

          console.log(`⚠️ Using cached curriculum data (${normalizedCache.levels.length} levels)`);
          return normalizedCache;
        }
      } catch (cacheError) {
        console.error('❌ Cache read failed:', cacheError.message);
      }
    }

    return {
      levels: [],
      totalModules: 0
    };
  }
};
