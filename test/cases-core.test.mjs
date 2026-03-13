import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createEmptyCase,
  normalizeCase,
  validateCase,
  toExportPayload,
  fromImportPayload,
} from '../assets/js/cases-core.mjs';

test('createEmptyCase returns default draft case', () => {
  const now = '2026-03-13T10:00:00.000Z';
  const c = createEmptyCase(now);

  assert.equal(c.status, 'draft');
  assert.equal(c.skillSlug, '');
  assert.equal(c.title, '');
  assert.equal(c.summary, '');
  assert.equal(c.tags, '');
  assert.equal(c.demoUrl, '');
  assert.equal(c.repoUrl, '');
  assert.equal(c.updatedAt, now);
  assert.ok(typeof c.id === 'string' && c.id.length > 0);
});

test('normalizeCase trims fields and keeps only supported status', () => {
  const input = {
    id: 'abc',
    skillSlug: '  ima-image-ai ',
    title: '  标题 ',
    summary: ' 描述 ',
    tags: ' 图像, 海报 ',
    demoUrl: ' https://example.com/demo ',
    repoUrl: ' https://github.com/imastuido/ima-image-ai ',
    status: 'published',
    updatedAt: '2026-03-13T00:00:00.000Z',
  };

  const c = normalizeCase(input);

  assert.equal(c.skillSlug, 'ima-image-ai');
  assert.equal(c.title, '标题');
  assert.equal(c.summary, '描述');
  assert.equal(c.tags, '图像, 海报');
  assert.equal(c.status, 'published');
});

test('validateCase returns errors for missing required fields and bad url', () => {
  const c = normalizeCase({
    skillSlug: '',
    title: '',
    summary: '',
    demoUrl: 'not-url',
    repoUrl: 'also-bad',
    status: 'draft',
  });

  const errors = validateCase(c);
  assert.deepEqual(errors, {
    skillSlug: '请选择技能',
    title: '请输入案例标题',
    summary: '请输入案例简介',
    demoUrl: 'Demo URL 必须是 http/https 链接',
    repoUrl: 'Repo URL 必须是 http/https 链接',
  });
});

test('toExportPayload and fromImportPayload keep cases sorted by updatedAt desc', () => {
  const list = [
    normalizeCase({
      id: '1',
      skillSlug: 'ima-image-ai',
      title: 'Old',
      summary: 'old',
      status: 'draft',
      updatedAt: '2026-03-01T00:00:00.000Z',
    }),
    normalizeCase({
      id: '2',
      skillSlug: 'ima-video-ai',
      title: 'New',
      summary: 'new',
      status: 'published',
      updatedAt: '2026-03-12T00:00:00.000Z',
    }),
  ];

  const payload = toExportPayload(list, '2026-03-13T00:00:00.000Z');
  assert.equal(payload.version, 1);
  assert.equal(payload.total, 2);
  assert.deepEqual(payload.cases.map((x) => x.id), ['2', '1']);

  const imported = fromImportPayload(payload);
  assert.deepEqual(imported.map((x) => x.id), ['2', '1']);
});

test('fromImportPayload throws when payload shape is invalid', () => {
  assert.throws(() => fromImportPayload({ version: 1, cases: 'oops' }), /cases 必须是数组/);
});
