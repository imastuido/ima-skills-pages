const SUPPORTED_STATUS = new Set(['draft', 'published']);

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `case_${Date.now()}_${rand}`;
}

function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStatus(value) {
  return SUPPORTED_STATUS.has(value) ? value : 'draft';
}

function isHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function isValidIsoDate(value) {
  if (!value) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

export function createEmptyCase(currentIso = nowIso()) {
  return {
    id: genId(),
    skillSlug: '',
    title: '',
    summary: '',
    tags: '',
    demoUrl: '',
    repoUrl: '',
    status: 'draft',
    updatedAt: currentIso,
  };
}

export function normalizeCase(input = {}) {
  const c = {
    id: toText(input.id) || genId(),
    skillSlug: toText(input.skillSlug),
    title: toText(input.title),
    summary: toText(input.summary),
    tags: toText(input.tags),
    demoUrl: toText(input.demoUrl),
    repoUrl: toText(input.repoUrl),
    status: normalizeStatus(input.status),
    updatedAt: isValidIsoDate(input.updatedAt) ? input.updatedAt : nowIso(),
  };

  return c;
}

export function validateCase(c) {
  const errors = {};

  if (!c.skillSlug) {
    errors.skillSlug = '请选择技能';
  }
  if (!c.title) {
    errors.title = '请输入案例标题';
  }
  if (!c.summary) {
    errors.summary = '请输入案例简介';
  }
  if (!isHttpUrl(c.demoUrl)) {
    errors.demoUrl = 'Demo URL 必须是 http/https 链接';
  }
  if (!isHttpUrl(c.repoUrl)) {
    errors.repoUrl = 'Repo URL 必须是 http/https 链接';
  }

  return errors;
}

function sortByUpdatedAtDesc(list) {
  return [...list].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

export function toExportPayload(casesList, exportedAt = nowIso()) {
  const normalized = sortByUpdatedAtDesc((casesList || []).map(normalizeCase));
  return {
    version: 1,
    exportedAt,
    total: normalized.length,
    cases: normalized,
  };
}

export function fromImportPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('导入内容格式错误');
  }
  if (!Array.isArray(payload.cases)) {
    throw new Error('cases 必须是数组');
  }

  return sortByUpdatedAtDesc(payload.cases.map(normalizeCase));
}
