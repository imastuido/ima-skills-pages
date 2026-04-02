# IMA Seedance 2.0 Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `ima-seedance2.0-video-generator` skill to the homepage, static skill list, tutorial surface, and manage showcase with install, tutorial, and workflow entry points.

**Architecture:** Keep the existing static-site structure, add one new tutorial page, and extend the homepage skill-card renderer in a backward-compatible way. To keep TDD realistic, extract the skill-card action/markup logic into a small pure ES module with node-test coverage, while reusing current CSS classes and page layout.

**Tech Stack:** Static HTML, vanilla JS, ES modules, `node --test`

---

## File Structure

- Create: `assets/js/skills-card-core.mjs`
- Create: `test/skills-card-core.test.mjs`
- Create: `demos/ima-seedance2-video-generator-tutorial.html`
- Modify: `assets/js/main.js`
- Modify: `assets/js/i18n.js`
- Modify: `assets/js/manage-showcase.mjs`
- Modify: `test/manage-showcase-core.test.mjs`
- Modify: `index.html`

### Task 1: Add a failing test for installable skill cards with tutorial and case links

**Files:**
- Create: `assets/js/skills-card-core.mjs`
- Test: `test/skills-card-core.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';

import { renderSkillCard } from '../assets/js/skills-card-core.mjs';

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
    labels: {
      copyLabel: 'GITHUB 安装',
      viewLabel: 'GitHub 仓库',
      tutorialLabel: '使用教程',
      caseShowcaseLabel: '案例展示',
      comingSoonLabel: '加群领取',
      comingSoonTitle: '加群领取该技能',
      comingSoonImageAlt: '加群二维码',
      recommendedLabel: '推荐',
    },
  });

  assert.match(html, /data-copy="git clone https:\/\/github.com\/imastuido\/ima-seedance2\.0-video-generator\.git"/);
  assert.match(html, />GitHub 仓库</);
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
      models: 'N\\/A',
      comingSoon: true,
      tutorialUrl: 'demos/example.html',
    },
    repoBase: 'https://github.com/imastuido',
    labels: {
      copyLabel: 'GITHUB 安装',
      viewLabel: 'GitHub 仓库',
      tutorialLabel: '使用教程',
      caseShowcaseLabel: '案例展示',
      comingSoonLabel: '加群领取',
      comingSoonTitle: '加群领取该技能',
      comingSoonImageAlt: '加群二维码',
      recommendedLabel: '推荐',
    },
  });

  assert.match(html, />加群领取</);
  assert.doesNotMatch(html, /data-copy=/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/skills-card-core.test.mjs`

Expected: FAIL with module-not-found or missing-export error for `renderSkillCard`

- [ ] **Step 3: Write minimal implementation**

```js
export function renderSkillCard({ skill, repoBase, labels }) {
  const safeRepoBase = String(repoBase || '').replace(/\/$/, '');
  const repoUrl = safeRepoBase ? `${safeRepoBase}/${skill.slug}` : '#';
  const gitCloneCmd = skill.installCommand || (safeRepoBase ? `git clone ${repoUrl}.git` : '');
  const tutorialUrl = skill.tutorialUrl || '';
  const caseUrl = skill.caseUrl || '';
  const isComingSoon = Boolean(skill.comingSoon);

  let actionsHtml = '';

  if (isComingSoon) {
    actionsHtml += `<button type="button" class="skill-comingsoon skill-comingsoon-btn">${labels.comingSoonLabel}</button>`;
  } else {
    if (gitCloneCmd) {
      actionsHtml += `<button type="button" class="skill-copy-btn" data-copy="${escapeHtml(gitCloneCmd)}">${escapeHtml(labels.copyLabel)}</button>`;
    }
    actionsHtml += `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener" class="skill-repo-link">${escapeHtml(labels.viewLabel)}</a>`;
  }

  if (tutorialUrl) {
    actionsHtml += `<a href="${escapeHtml(tutorialUrl)}" class="skill-repo-link skill-tutorial-link">${escapeHtml(labels.tutorialLabel)}</a>`;
  }
  if (caseUrl) {
    actionsHtml += `<a href="${escapeHtml(caseUrl)}" class="skill-repo-link skill-case-link">${escapeHtml(labels.caseShowcaseLabel)}</a>`;
  }

  return `<div class="skill-card"><h3>${escapeHtml(skill.name)}</h3><p>${escapeHtml(skill.shortDesc)}</p><div class="skill-models">${escapeHtml(skill.models)}</div><div class="skill-actions">${actionsHtml}</div></div>`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/skills-card-core.test.mjs`

Expected: PASS, 2 tests, 0 failures

- [ ] **Step 5: Commit**

```bash
git add test/skills-card-core.test.mjs assets/js/skills-card-core.mjs
git commit -m "test: cover homepage skill card actions"
```

### Task 2: Refactor homepage rendering to use the tested card renderer

**Files:**
- Modify: `assets/js/main.js`
- Modify: `index.html`

- [ ] **Step 1: Write the failing integration test**

Append this assertion to `test/skills-card-core.test.mjs`:

```js
test('renderSkillCard includes repo url text for installable skills', () => {
  const html = renderSkillCard({
    skill: {
      name: 'IMA Seedance 2.0 Video Generator',
      slug: 'ima-seedance2.0-video-generator',
      tag: 'Seedance',
      shortDesc: 'Seedance 2.0 video generation skill.',
      models: 'ima-pro · ima-pro-fast',
    },
    repoBase: 'https://github.com/imastuido',
    labels: {
      copyLabel: 'GITHUB 安装',
      viewLabel: 'GitHub 仓库',
      tutorialLabel: '使用教程',
      caseShowcaseLabel: '案例展示',
      comingSoonLabel: '加群领取',
      comingSoonTitle: '加群领取该技能',
      comingSoonImageAlt: '加群二维码',
      recommendedLabel: '推荐',
    },
  });

  assert.match(html, /https:\/\/github\.com\/imastuido\/ima-seedance2\.0-video-generator/);
});
```

- [ ] **Step 2: Run test to verify it fails for missing repo-url markup**

Run: `node --test test/skills-card-core.test.mjs`

Expected: FAIL because repo-url text is not rendered yet

- [ ] **Step 3: Write minimal implementation**

Update `renderSkillCard()` so installable skills keep the existing repo-url paragraph:

```js
const repoUrlHtml = !isComingSoon && repoUrl !== '#'
  ? `<p class="skill-repo-url-wrap"><a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener" class="skill-repo-url">${escapeHtml(repoUrl)}</a></p>`
  : '';

return `<div class="skill-card">...${repoUrlHtml}<div class="skill-actions">${actionsHtml}</div></div>`;
```

Then refactor `assets/js/main.js` to import and call `renderSkillCard`, and change the script tag in `index.html` to:

```html
<script type="module" src="assets/js/main.js"></script>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/skills-card-core.test.mjs`

Expected: PASS, 3 tests, 0 failures

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js index.html assets/js/skills-card-core.mjs test/skills-card-core.test.mjs
git commit -m "refactor: move homepage skill card rendering into tested module"
```

### Task 3: Add the Seedance 2.0 content entry and tutorial page

**Files:**
- Modify: `assets/js/i18n.js`
- Modify: `index.html`
- Create: `demos/ima-seedance2-video-generator-tutorial.html`

- [ ] **Step 1: Write the failing content test**

Add a new test file `test/seedance-page-content.test.mjs` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('index.html static list contains Seedance 2.0 skill links', () => {
  assert.match(indexHtml, /ima-seedance2\.0-video-generator/);
  assert.match(indexHtml, /demos\/ima-seedance2-video-generator-tutorial\.html/);
  assert.match(indexHtml, /manage\.html/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/seedance-page-content.test.mjs`

Expected: FAIL because the static list entry does not exist yet

- [ ] **Step 3: Write minimal implementation**

Add the bilingual skill entry in `assets/js/i18n.js` with:

- slug `ima-seedance2.0-video-generator`
- tutorial URL `demos/ima-seedance2-video-generator-tutorial.html`
- case URL `manage.html`
- short copy aligned with `SKILL.md` and `clawhub.json`

Add one static list item in `index.html`:

```html
<li><strong>IMA Seedance 2.0 Video Generator</strong> <a href="https://github.com/imastuido/ima-seedance2.0-video-generator">https://github.com/imastuido/ima-seedance2.0-video-generator</a> — <code>git clone https://github.com/imastuido/ima-seedance2.0-video-generator.git</code> · <a href="demos/ima-seedance2-video-generator-tutorial.html">使用教程</a> · <a href="manage.html">案例展示</a></li>
```

Create `demos/ima-seedance2-video-generator-tutorial.html` with sections:

- intro and model positioning
- why teams choose it
- recommended inputs
- four anchored workflows
- install and call
- scope boundary

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/seedance-page-content.test.mjs`

Expected: PASS, 1 test, 0 failures

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js index.html demos/ima-seedance2-video-generator-tutorial.html test/seedance-page-content.test.mjs
git commit -m "feat: add Seedance 2.0 homepage and tutorial content"
```

### Task 4: Add Seedance 2.0 workflow entries to the manage showcase

**Files:**
- Modify: `assets/js/manage-showcase.mjs`
- Modify: `test/manage-showcase-core.test.mjs`

- [ ] **Step 1: Write the failing test**

Append this test:

```js
test('buildSections keeps Seedance 2.0 workflow showcase links in tool skills', () => {
  const sections = buildSections({
    skills: [
      { slug: 'ima-seedance2.0-video-generator', name: 'IMA Seedance 2.0 Video Generator', shortDesc: 'Seedance skill' },
    ],
    groups: [
      { key: 'tool', label: '工具技能' },
      { key: 'pro', label: '专业技能' },
    ],
    sectionMap: {
      'ima-seedance2.0-video-generator': 'tool',
    },
    casesMap: {
      'ima-seedance2.0-video-generator': [
        { title: '教程总览', url: 'demos/ima-seedance2-video-generator-tutorial.html' },
        { title: 'Text to Video', url: 'demos/ima-seedance2-video-generator-tutorial.html#text-to-video' },
        { title: 'Image to Video', url: 'demos/ima-seedance2-video-generator-tutorial.html#image-to-video' },
        { title: 'First Last Frame', url: 'demos/ima-seedance2-video-generator-tutorial.html#first-last-frame' },
        { title: 'Reference Media', url: 'demos/ima-seedance2-video-generator-tutorial.html#reference-media' },
      ],
    },
  });

  assert.equal(sections[0].cards.length, 1);
  assert.equal(sections[0].cards[0].cases.length, 5);
  assert.equal(sections[0].cards[0].cases[4].url, 'demos/ima-seedance2-video-generator-tutorial.html#reference-media');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/manage-showcase-core.test.mjs`

Expected: FAIL because the test fixture is not yet covered by the real page registration

- [ ] **Step 3: Write minimal implementation**

Update `assets/js/manage-showcase.mjs`:

- add `'ima-seedance2.0-video-generator': 'tool'` to `SECTION_MAP`
- add the tutorial and four workflow anchors to `CASES_MAP`

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/manage-showcase-core.test.mjs`

Expected: PASS, all tests green

- [ ] **Step 5: Commit**

```bash
git add assets/js/manage-showcase.mjs test/manage-showcase-core.test.mjs
git commit -m "feat: add Seedance 2.0 workflow entries to showcase page"
```

### Task 5: Full verification

**Files:**
- Modify: none
- Test: `test/skills-card-core.test.mjs`
- Test: `test/seedance-page-content.test.mjs`
- Test: `test/manage-showcase-core.test.mjs`

- [ ] **Step 1: Run the full verification command**

Run: `node --test test/skills-card-core.test.mjs test/seedance-page-content.test.mjs test/manage-showcase-core.test.mjs`

Expected: PASS, 0 failures

- [ ] **Step 2: Run link-level spot checks**

Run:

```bash
rg -n "ima-seedance2\\.0-video-generator|ima-seedance2-video-generator-tutorial|#text-to-video|#image-to-video|#first-last-frame|#reference-media" index.html assets/js/i18n.js assets/js/manage-showcase.mjs demos/ima-seedance2-video-generator-tutorial.html
```

Expected: every required entry appears in the intended file

- [ ] **Step 3: Commit**

```bash
git add assets/js/i18n.js assets/js/main.js assets/js/skills-card-core.mjs assets/js/manage-showcase.mjs index.html demos/ima-seedance2-video-generator-tutorial.html test/skills-card-core.test.mjs test/seedance-page-content.test.mjs test/manage-showcase-core.test.mjs
git commit -m "feat: add Seedance 2.0 landing and showcase pages"
```
