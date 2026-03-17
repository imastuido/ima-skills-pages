(function () {
  const STORAGE_KEY = "ima-skills-lang";
  const DEFAULT_LANG = "zh";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    render(lang);
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function getNested(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o && o[k];
    }, obj);
  }

  function render(lang) {
    const t = window.I18N[lang];
    if (!t) return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getNested(t, key);
      if (val != null) el.textContent = val;
    });

    // Features
    var featuresContainer = document.getElementById("features-list");
    if (featuresContainer && t.features && t.features.items) {
      featuresContainer.innerHTML = t.features.items
        .map(
          function (item) {
            return (
              '<div class="feature-card">' +
              "<h3>" +
              escapeHtml(item.title) +
              "</h3>" +
              "<p>" +
              escapeHtml(item.desc) +
              "</p>" +
              "</div>"
            );
          }
        )
        .join("");
    }

    // Skills
    var skillsContainer = document.getElementById("skills-list");
    if (skillsContainer && t.skills && t.skills.list) {
      var repoBase = (t.skills.repoBaseUrl || "").replace(/\/$/, "");
      var copyLabel = t.skills.copyInstall || "Git install";
      var viewLabel = t.skills.viewOnGitHub || "GitHub";
      var comingSoonLabel = t.skills.comingSoon || "敬请期待";
      var recommendedLabel = t.skills.recommended || "推荐";
      var tutorialLabel = t.skills.useTutorial || "使用教程";
      var caseShowcaseLabel = t.skills.caseShowcase || "案例展示";
      skillsContainer.innerHTML = t.skills.list
        .map(
          function (s) {
            var isComingSoon = !!s.comingSoon;
            var isRecommended = !!s.recommended;
            var tutorialUrl = s.tutorialUrl || "";
            var caseUrl = s.caseUrl || "";
            var repoUrl = repoBase ? repoBase + "/" + s.slug : "#";
            var gitCloneCmd = s.installCommand || (repoBase ? "git clone " + repoUrl + ".git" : "");
            var tagHtml =
              '<span class="skill-tag">' +
              escapeHtml(s.tag) +
              "</span>" +
              (isRecommended
                ? ('<span class="skill-recommended">' + escapeHtml(recommendedLabel) + "</span>")
                : "");
            var actionsHtml = "";
            if (isComingSoon) {
              actionsHtml += '<span class="skill-comingsoon">' + escapeHtml(comingSoonLabel) + "</span>";
              if (tutorialUrl) {
                actionsHtml +=
                  '<a href="' +
                  escapeHtml(tutorialUrl) +
                  '" class="skill-repo-link skill-tutorial-link">' +
                  escapeHtml(tutorialLabel) +
                  "</a>";
              }
              if (caseUrl) {
                actionsHtml +=
                  '<a href="' +
                  escapeHtml(caseUrl) +
                  '" class="skill-repo-link skill-case-link">' +
                  escapeHtml(caseShowcaseLabel) +
                  "</a>";
              }
            } else {
              actionsHtml +=
                (gitCloneCmd
                  ? ('<button type="button" class="skill-copy-btn" data-copy="' +
                      escapeHtml(gitCloneCmd) +
                      '" title="' +
                      escapeHtml(gitCloneCmd) +
                      '">' +
                      escapeHtml(copyLabel) +
                      "</button>")
                  : "") +
                '<a href="' +
                escapeHtml(repoUrl) +
                '" target="_blank" rel="noopener" class="skill-repo-link">' +
                escapeHtml(viewLabel) +
                "</a>";
            }
            return (
              '<div class="skill-card">' +
              tagHtml +
              "<h3>" +
              escapeHtml(s.name) +
              "</h3>" +
              "<p>" +
              escapeHtml(s.shortDesc) +
              "</p>" +
              '<div class="skill-models">' +
              escapeHtml(s.models) +
              "</div>" +
              (!isComingSoon && repoUrl !== "#"
                ? ('<p class="skill-repo-url-wrap"><a href="' +
                    escapeHtml(repoUrl) +
                    '" target="_blank" rel="noopener" class="skill-repo-url">' +
                    escapeHtml(repoUrl) +
                    "</a></p>")
                : "") +
              '<div class="skill-actions">' +
              actionsHtml +
              "</div>" +
              "</div>"
            );
          }
        )
        .join("");
      bindSkillCopyButtons();
    }

    // How steps
    var howContainer = document.getElementById("how-steps");
    if (howContainer && t.how && t.how.steps) {
      howContainer.innerHTML = t.how.steps
        .map(
          function (step) {
            return (
              '<div class="how-step">' +
              '<span class="step-num">' +
              escapeHtml(step.step) +
              "</span>" +
              "<h3>" +
              escapeHtml(step.title) +
              "</h3>" +
              "<p>" +
              escapeHtml(step.desc) +
              "</p>" +
              "</div>"
            );
          }
        )
        .join("");
    }

    // Section titles/subtitles that are in i18n
    var sectionTitles = {
      "features.title": "features-title",
      "features.subtitle": "features-subtitle",
      "skills.title": "skills-title",
      "skills.subtitle": "skills-subtitle",
      "skills.installHint": "skills-hint-text",
      "how.title": "how-title",
      "how.subtitle": "how-subtitle",
      "cta.title": "cta-title",
      "cta.subtitle": "cta-subtitle",
      "cta.button": "cta-button-text",
      "footer.brand": "footer-brand",
      "footer.lang": "footer-lang",
    };
    Object.keys(sectionTitles).forEach(function (key) {
      var id = sectionTitles[key];
      var el = document.getElementById(id);
      var val = getNested(t, key);
      if (el && val != null) el.textContent = val;
    });
  }

  function escapeHtml(str) {
    if (str == null) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function bindSkillCopyButtons() {
    var container = document.getElementById("skills-list");
    if (!container) return;
    var t = window.I18N[getLang()];
    var copiedText = (t && t.skills && t.skills.copied) ? t.skills.copied : "Copied";
    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".skill-copy-btn");
      if (!btn) return;
      var cmd = btn.getAttribute("data-copy");
      if (!cmd) return;
      if (typeof navigator.clipboard !== "undefined" && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(
          function () {
            var orig = btn.textContent;
            btn.textContent = copiedText;
            btn.classList.add("skill-copy-done");
            setTimeout(function () {
              btn.textContent = orig;
              btn.classList.remove("skill-copy-done");
            }, 1500);
          },
          function () { fallbackCopy(cmd, btn, copiedText); }
        );
      } else {
        fallbackCopy(cmd, btn, copiedText);
      }
    });
  }

  function fallbackCopy(text, btn, copiedText) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      var orig = btn.textContent;
      btn.textContent = copiedText;
      btn.classList.add("skill-copy-done");
      setTimeout(function () {
        btn.textContent = orig;
        btn.classList.remove("skill-copy-done");
      }, 1500);
    } catch (err) {}
    document.body.removeChild(ta);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lang = getLang();
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.dataset.lang);
      });
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    render(lang);
  });

  window.setLang = setLang;
  window.getLang = getLang;
})();
