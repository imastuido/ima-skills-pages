import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const i18nSource = readFileSync(new URL('../assets/js/i18n.js', import.meta.url), 'utf8');
const manageSource = readFileSync(new URL('../assets/js/manage-showcase.mjs', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(i18nSource, context);
const i18n = context.window.I18N;

test('index.html static list contains Seedance 2.0 skill links', () => {
  assert.match(indexHtml, /ima-seedance2\.0-video-generator/);
  assert.match(indexHtml, /demos\/ima-seedance2-video-generator-tutorial\.html/);
  assert.match(indexHtml, /manage\.html/);
});

test('manage showcase registers Seedance 2.0 workflow entries', () => {
  assert.match(manageSource, /'ima-seedance2\.0-video-generator': 'tool'/);
  assert.match(manageSource, /demos\/ima-seedance2-video-generator-tutorial\.html#text-to-video/);
  assert.match(manageSource, /demos\/ima-seedance2-video-generator-tutorial\.html#reference-media/);
});

test('Seedance 2.0 is the second skill card in both zh and en lists', () => {
  assert.equal(i18n.zh.skills.list[1].slug, 'ima-seedance2.0-video-generator');
  assert.equal(i18n.en.skills.list[1].slug, 'ima-seedance2.0-video-generator');
});

test('index.html static skill list keeps Seedance 2.0 as the second visible item after Knowledge AI', () => {
  const items = Array.from(indexHtml.matchAll(/<li><strong>(.*?)<\/strong>/g)).map((match) => match[1]);

  assert.equal(items[0], 'IMA Knowledge AI（必装前置）');
  assert.equal(items[1], 'IMA Seedance 2.0 Video Generator');
});
