import test from 'node:test';
import assert from 'node:assert/strict';

import { renderSkillCard } from '../assets/js/skills-card-core.mjs';

const labels = {
  copyLabel: 'GITHUB 安装',
  viewLabel: 'GitHub 仓库',
  tutorialLabel: '使用教程',
  caseShowcaseLabel: '案例展示',
  comingSoonLabel: '加群领取',
  comingSoonTitle: '加群领取该技能',
  comingSoonImageAlt: '加群二维码',
  recommendedLabel: '推荐',
};

test('renderSkillCard keeps install actions and adds tutorial/case links for installable skills', () => {
  const html = renderSkillCard({
    skill: {
      name: 'IMA Seedance 2.0 Video Generator',
      slug: 'ima-seedance2.0-video-generator',
      tag: 'Seedance',
      shortDesc: 'Seedance 2.0 video generation skill.',
      models: 'ima-pro · ima-pro-fast',
      tutorialUrl: 'demos/ima-seedance2-video-generator-tutorial.html',
      caseUrl: 'manage.html',
    },
    repoBase: 'https://github.com/imastuido',
    labels,
  });

  assert.match(html, /data-copy="git clone https:\/\/github.com\/imastuido\/ima-seedance2\.0-video-generator\.git"/);
  assert.match(html, />GitHub 仓库</);
  assert.match(html, /https:\/\/github\.com\/imastuido\/ima-seedance2\.0-video-generator/);
  assert.match(html, /demos\/ima-seedance2-video-generator-tutorial\.html/);
  assert.match(html, /manage\.html/);
});

test('renderSkillCard preserves comingSoon flow without git actions', () => {
  const html = renderSkillCard({
    skill: {
      name: 'Coming Soon Skill',
      slug: 'coming-soon-skill',
      tag: 'Soon',
      shortDesc: 'Waiting list',
      models: 'N/A',
      comingSoon: true,
      tutorialUrl: 'demos/example.html',
    },
    repoBase: 'https://github.com/imastuido',
    labels,
  });

  assert.match(html, />加群领取</);
  assert.match(html, /demos\/example\.html/);
  assert.doesNotMatch(html, /data-copy=/);
});
