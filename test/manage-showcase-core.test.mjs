import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSections,
  deriveCaseTitle,
  normalizeCaseLinks,
} from '../assets/js/manage-showcase-core.mjs';

test('deriveCaseTitle infers readable title from demo path', () => {
  assert.equal(deriveCaseTitle('demos/brave-bunny.html'), 'Brave Bunny');
  assert.equal(deriveCaseTitle('/demos/fairytale-picturebook-pro-tutorial.html'), 'Fairytale Picturebook Pro Tutorial');
});

test('normalizeCaseLinks keeps valid links and fills missing title', () => {
  const links = normalizeCaseLinks([
    'demos/brave-bunny.html',
    { url: 'demos/fairytale-picturebook-pro-tutorial.html', title: '使用教程' },
    { url: '   ' },
  ]);

  assert.deepEqual(links, [
    { url: 'demos/brave-bunny.html', title: 'Brave Bunny' },
    { url: 'demos/fairytale-picturebook-pro-tutorial.html', title: '使用教程' },
  ]);
});

test('buildSections groups skill cards by category and carries multiple cases', () => {
  const skills = [
    { slug: 'ima-image-ai', name: 'IMA 图像生成', shortDesc: '图像能力' },
    { slug: 'fairytale-picturebook-pro', name: '绘本漫画', shortDesc: '场景技能' },
    { slug: 'ima-video-ai', name: 'IMA 视频生成', shortDesc: '视频能力' },
  ];

  const groups = [
    { key: 'tool', label: '工具技能' },
    { key: 'pro', label: '专业技能' },
  ];

  const sectionMap = {
    'ima-image-ai': 'tool',
    'ima-video-ai': 'tool',
    'fairytale-picturebook-pro': 'pro',
  };

  const casesMap = {
    'ima-image-ai': ['demos/brave-bunny.html'],
    'fairytale-picturebook-pro': [
      { url: 'demos/brave-bunny.html', title: '勇敢兔兔' },
      'demos/fairytale-picturebook-pro-tutorial.html',
    ],
  };

  const sections = buildSections({ skills, groups, sectionMap, casesMap });

  assert.equal(sections.length, 2);
  assert.equal(sections[0].label, '工具技能');
  assert.equal(sections[1].label, '专业技能');
  assert.equal(sections[0].cards.length, 2);
  assert.equal(sections[1].cards.length, 1);

  const proCases = sections[1].cards[0].cases;
  assert.deepEqual(proCases, [
    { url: 'demos/brave-bunny.html', title: '勇敢兔兔' },
    { url: 'demos/fairytale-picturebook-pro-tutorial.html', title: 'Fairytale Picturebook Pro Tutorial' },
  ]);
});
