export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderSkillCard({ skill, repoBase, labels }) {
  const safeRepoBase = String(repoBase || '').replace(/\/$/, '');
  const repoUrl = safeRepoBase ? `${safeRepoBase}/${skill.slug}` : '#';
  const gitCloneCmd = skill.installCommand || (safeRepoBase ? `git clone ${repoUrl}.git` : '');
  const tutorialUrl = skill.tutorialUrl || '';
  const caseUrl = skill.caseUrl || '';
  const isComingSoon = Boolean(skill.comingSoon);
  const isRecommended = Boolean(skill.recommended);
  const comingSoonImage = skill.comingSoonImage || 'assets/images/join-group-claim-qr.png';

  const tagHtml =
    '<span class="skill-tag">' +
    escapeHtml(skill.tag) +
    '</span>' +
    (isRecommended
      ? `<span class="skill-recommended">${escapeHtml(labels.recommendedLabel || '推荐')}</span>`
      : '');

  let actionsHtml = '';

  if (isComingSoon) {
    actionsHtml +=
      '<button type="button" class="skill-comingsoon skill-comingsoon-btn"' +
      ` data-comingsoon-image="${escapeHtml(comingSoonImage)}"` +
      ` data-comingsoon-title="${escapeHtml(labels.comingSoonTitle || '加群领取该技能')}"` +
      ` data-comingsoon-alt="${escapeHtml(labels.comingSoonImageAlt || 'Group QR code')}"` +
      '>' +
      escapeHtml(labels.comingSoonLabel || '敬请期待') +
      '</button>';
  } else {
    if (gitCloneCmd) {
      actionsHtml +=
        '<button type="button" class="skill-copy-btn"' +
        ` data-copy="${escapeHtml(gitCloneCmd)}"` +
        ` title="${escapeHtml(gitCloneCmd)}"` +
        '>' +
        escapeHtml(labels.copyLabel || 'Git install') +
        '</button>';
    }

    actionsHtml +=
      `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener" class="skill-repo-link">` +
      escapeHtml(labels.viewLabel || 'GitHub') +
      '</a>';
  }

  if (tutorialUrl) {
    actionsHtml +=
      `<a href="${escapeHtml(tutorialUrl)}" class="skill-repo-link skill-tutorial-link">` +
      escapeHtml(labels.tutorialLabel || 'Tutorial') +
      '</a>';
  }

  if (caseUrl) {
    actionsHtml +=
      `<a href="${escapeHtml(caseUrl)}" class="skill-repo-link skill-case-link">` +
      escapeHtml(labels.caseShowcaseLabel || 'Case Showcase') +
      '</a>';
  }

  const repoUrlHtml =
    !isComingSoon && repoUrl !== '#'
      ? '<p class="skill-repo-url-wrap">' +
        `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener" class="skill-repo-url">` +
        escapeHtml(repoUrl) +
        '</a></p>'
      : '';

  return (
    '<div class="skill-card">' +
    tagHtml +
    '<h3>' +
    escapeHtml(skill.name) +
    '</h3>' +
    '<p>' +
    escapeHtml(skill.shortDesc) +
    '</p>' +
    '<div class="skill-models">' +
    escapeHtml(skill.models) +
    '</div>' +
    repoUrlHtml +
    '<div class="skill-actions">' +
    actionsHtml +
    '</div>' +
    '</div>'
  );
}
