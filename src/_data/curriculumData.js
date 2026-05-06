const https = require('https');
const fs = require('fs');
const path = require('path');

const CURRICULUM_JSON_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnT9zQZMPfwAwsUoI5lYR8qrlW8V1lH-_9lS5l0D4FYpZFGWuLV4kxsK976Gog2y0qQRLiX7flsLYlu1IfCDH5J0o8cctKcJuPNa3uY_Sac5RnzE6GcJmiOHSqXFe4xIUYFjN60vY6ulJPCgZN5WcvmlhPHCZJotSrWPj0GbOqV3xQjuHPIW0xDm7K1XHk0l8Ny2si2lG53YtYdzmBc0LbzNsWD3yIKBaOuNU0WwNI40W6kg4UEGYnsB8m59NVFLPJKBirZLs_Tm5SVtd82LBsK4YqlPFw&lib=MH22ekMWpk3hvjZrINFFapw8mHdyRNTio';
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

function normalizeSubModule(rawSub, index) {
  const topic = pickFirstString(rawSub, ['topic', 'title', 'name', 'module', 'subModule', 'submodule']);
  const description = pickFirstString(rawSub, ['description', 'desc', 'summary', 'content']);

  if (!topic && !description) {
    return null;
  }

  return {
    topic: topic || `Sub-module ${index + 1}`,
    description
  };
}

function normalizeModule(rawModule, index) {
  const topic = pickFirstString(rawModule, ['topic', 'title', 'name', 'module']);
  const description = pickFirstString(rawModule, ['description', 'desc', 'summary', 'content']);
  const hours = pickFirstString(rawModule, ['hours', 'totalHours', 'moduleHours', 'hour']);
  const teachingStrategy = pickFirstString(rawModule, [
    'teachingStrategy',
    'teaching strategy',
    'deliveryFormat',
    'delivery format',
    'strategy'
  ]);
  const number = pickFirstString(rawModule, ['number', 'moduleNumber', 'module number', 'id']);

  const rawSubModules = [
    ...asArray(rawModule?.subModules),
    ...asArray(rawModule?.submodules),
    ...asArray(rawModule?.children)
  ];

  const subModules = rawSubModules
    .map((subModule, subIndex) => normalizeSubModule(subModule, subIndex))
    .filter(Boolean);

  if (!topic && !description && !hours && !teachingStrategy && subModules.length === 0) {
    return null;
  }

  return {
    number: number || `${index + 1}`,
    topic: topic || `Module ${index + 1}`,
    description,
    hours,
    teachingStrategy,
    subModules
  };
}

function sectionLooksLikePractical(section) {
  const sectionTitle = pickFirstString(section, ['title', 'name', 'section', 'label']);
  return /experiential\s*\/?\s*personal\s*\/?\s*group\s*work/i.test(sectionTitle);
}

function normalizePracticalItem(item, index) {
  const topic = pickFirstString(item, ['topic', 'title', 'name', 'module']);
  const teachingStrategy = pickFirstString(item, [
    'teachingStrategy',
    'teaching strategy',
    'deliveryFormat',
    'delivery format',
    'strategy'
  ]);

  if (!topic && !teachingStrategy) {
    return null;
  }

  return {
    topic: topic || `Experiential item ${index + 1}`,
    teachingStrategy
  };
}

function extractPracticalItems(level) {
  const directPractical = asArray(level?.practical)
    .concat(asArray(level?.practicalItems))
    .concat(asArray(level?.experiential));

  const sectionPractical = asArray(level?.sections)
    .filter(sectionLooksLikePractical)
    .flatMap((section) => {
      return []
        .concat(asArray(section?.activities))
        .concat(asArray(section?.items))
        .concat(asArray(section?.modules));
    });

  return directPractical
    .concat(sectionPractical)
    .map((item, index) => normalizePracticalItem(item, index))
    .filter(Boolean);
}

function extractModules(level) {
  const fromLevel = asArray(level?.modules);
  const fromSections = asArray(level?.sections)
    .filter((section) => !sectionLooksLikePractical(section))
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

  const levels = rawLevels
    .map((level, index) => {
      const modules = extractModules(level);
      const practicalItems = extractPracticalItems(level);
      const label = pickFirstString(level, ['label', 'level', 'id']) || `Level ${index + 1}`;
      const title = pickFirstString(level, ['title', 'name', 'heading']) || 'Curriculum Level';

      return {
        id: `level${index + 1}`,
        label,
        title,
        modules,
        practicalItems
      };
    })
    .filter((level) => level.modules.length > 0 || level.practicalItems.length > 0);

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

    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(normalized, null, 2));
      console.log(`✅ Curriculum cache saved (${normalized.levels.length} levels, ${normalized.totalModules} modules)`);
    } catch (cacheError) {
      console.warn('⚠️ Could not save curriculum cache:', cacheError.message);
    }

    return normalized;
  } catch (error) {
    console.error('Error fetching curriculum data:', error.message);

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        if (Array.isArray(cached?.levels) && cached.levels.length > 0) {
          console.log(`⚠️ Using cached curriculum data (${cached.levels.length} levels)`);
          return cached;
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
