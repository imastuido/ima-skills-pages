function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function titleize(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function deriveCaseTitle(url) {
  const raw = toText(url);
  if (!raw) return '案例';

  const clean = raw.split('#')[0].split('?')[0];
  const last = clean.split('/').filter(Boolean).pop() || clean;
  const base = last.replace(/\.[^.]+$/, '');
  const readable = base.replace(/[-_]+/g, ' ').trim();

  return readable ? titleize(readable) : '案例';
}

export function normalizeCaseLinks(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === 'string') {
        const url = toText(item);
        if (!url) return null;
        return { url, title: deriveCaseTitle(url) };
      }

      if (!item || typeof item !== 'object') return null;

      const url = toText(item.url);
      if (!url) return null;

      const title = toText(item.title) || deriveCaseTitle(url);
      return { url, title };
    })
    .filter(Boolean);
}

export function buildSections({ skills = [], groups = [], sectionMap = {}, casesMap = {} }) {
  const seeded = groups.map((group) => ({
    key: toText(group.key),
    label: toText(group.label),
    cards: [],
  }));

  const sectionByKey = new Map(seeded.map((section) => [section.key, section]));
  const defaultKey = seeded[0] ? seeded[0].key : '';

  skills.forEach((skill) => {
    const slug = toText(skill && skill.slug);
    if (!slug) return;

    const sectionKey = toText(sectionMap[slug]) || defaultKey;
    const section = sectionByKey.get(sectionKey);
    if (!section) return;

    section.cards.push({
      slug,
      name: toText(skill.name) || slug,
      shortDesc: toText(skill.shortDesc),
      cases: normalizeCaseLinks(casesMap[slug]),
    });
  });

  return seeded;
}
