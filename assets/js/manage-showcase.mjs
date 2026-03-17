import { buildSections } from './manage-showcase-core.mjs';

const GROUPS = [
  { key: 'tool', label: '工具技能' },
  { key: 'pro', label: '专业技能' },
];

const SECTION_MAP = {
  'ima-all-ai': 'tool',
  'ima-image-ai': 'tool',
  'ima-video-ai': 'tool',
  'ima-voice-ai': 'tool',
  'ima-tts-ai': 'tool',
  'ima-knowledge-ai': 'tool',
  'ai-nano-banana-ima': 'tool',
  'fairytale-picturebook-pro': 'pro',
};

const CASES_MAP = {
  'fairytale-picturebook-pro': [
    { title: '勇敢兔兔', url: 'demos/brave-bunny.html' },
    { title: '小恐龙学会分享（有声绘本）', url: 'demos/little-dinosaur-sharing/index.html' },
    { title: '绘本漫画教程', url: 'demos/fairytale-picturebook-pro-tutorial.html' },
  ],
};

const state = {
  sections: [],
  activeGroupKey: GROUPS[0].key,
};

function $(id) {
  return document.getElementById(id);
}

function getSkillList() {
  const fromI18n =
    window.I18N &&
    window.I18N.zh &&
    window.I18N.zh.skills &&
    Array.isArray(window.I18N.zh.skills.list)
      ? window.I18N.zh.skills.list
      : [];

  return fromI18n.map((skill) => ({
    slug: skill.slug,
    name: skill.name,
    shortDesc: skill.shortDesc,
  }));
}

function renderTabs() {
  const tabs = $('manage-tabs');
  tabs.innerHTML = '';

  state.sections.forEach((section) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'manage-tab';
    btn.dataset.group = section.key;
    if (section.key === state.activeGroupKey) {
      btn.classList.add('active');
    }
    btn.textContent = `${section.label} (${section.cards.length})`;
    tabs.appendChild(btn);
  });
}

function renderCards() {
  const grid = $('manage-skill-grid');
  const empty = $('manage-empty');
  grid.innerHTML = '';

  const section = state.sections.find((x) => x.key === state.activeGroupKey);
  const cards = section ? section.cards : [];

  empty.style.display = cards.length === 0 ? 'block' : 'none';

  cards.forEach((card) => {
    const article = document.createElement('article');
    article.className = 'skill-showcase-card';

    const title = document.createElement('h3');
    title.textContent = card.name;
    article.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'skill-showcase-desc';
    desc.textContent = card.shortDesc || '暂无简介';
    article.appendChild(desc);

    const meta = document.createElement('p');
    meta.className = 'skill-showcase-meta';
    meta.textContent = `Slug: ${card.slug}`;
    article.appendChild(meta);

    const caseTitle = document.createElement('h4');
    caseTitle.className = 'skill-showcase-case-title';
    caseTitle.textContent = '技能案例';
    article.appendChild(caseTitle);

    const caseList = document.createElement('div');
    caseList.className = 'skill-case-links';

    if (card.cases.length === 0) {
      const none = document.createElement('span');
      none.className = 'skill-case-empty';
      none.textContent = '暂无案例';
      caseList.appendChild(none);
    } else {
      card.cases.forEach((item) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'skill-case-item';
        link.textContent = item.title;
        caseList.appendChild(link);
      });
    }

    article.appendChild(caseList);
    grid.appendChild(article);
  });
}

function bindEvents() {
  $('manage-tabs').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-group]');
    if (!btn) return;

    const groupKey = btn.dataset.group;
    if (!groupKey || groupKey === state.activeGroupKey) return;

    state.activeGroupKey = groupKey;
    renderTabs();
    renderCards();
  });
}

function bootstrap() {
  const skills = getSkillList();
  state.sections = buildSections({
    skills,
    groups: GROUPS,
    sectionMap: SECTION_MAP,
    casesMap: CASES_MAP,
  });

  if (!state.sections.find((x) => x.key === state.activeGroupKey)) {
    state.activeGroupKey = state.sections[0] ? state.sections[0].key : '';
  }

  renderTabs();
  renderCards();
  bindEvents();
}

document.addEventListener('DOMContentLoaded', bootstrap);
