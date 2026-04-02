import { renderSkillCard } from "./skills-card-core.mjs";

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
      var labels = {
        copyLabel: t.skills.copyInstall || "Git install",
        viewLabel: t.skills.viewOnGitHub || "GitHub",
        comingSoonLabel: t.skills.comingSoon || "敬请期待",
        comingSoonTitle: t.skills.joinGroupClaimTitle || "加群领取该技能",
        comingSoonImageAlt: t.skills.joinGroupClaimImageAlt || "Group QR code",
        recommendedLabel: t.skills.recommended || "推荐",
        tutorialLabel: t.skills.useTutorial || "使用教程",
        caseShowcaseLabel: t.skills.caseShowcase || "案例展示",
      };
      skillsContainer.innerHTML = t.skills.list
        .map(function (s) {
          return renderSkillCard({
            skill: s,
            repoBase: repoBase,
            labels: labels,
          });
        })
        .join("");
      syncComingSoonModalText(t);
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
    if (container.dataset.bound === "1") return;
    container.dataset.bound = "1";
    container.addEventListener("click", function (e) {
      var comingSoonBtn = e.target.closest(".skill-comingsoon-btn");
      if (comingSoonBtn) {
        openComingSoonModal(
          comingSoonBtn.getAttribute("data-comingsoon-image") || "assets/images/join-group-claim-qr.png",
          comingSoonBtn.getAttribute("data-comingsoon-alt") || "Group QR code",
          comingSoonBtn.getAttribute("data-comingsoon-title") || ""
        );
        return;
      }

      var btn = e.target.closest(".skill-copy-btn");
      if (!btn) return;
      var cmd = btn.getAttribute("data-copy");
      if (!cmd) return;
      var t = window.I18N[getLang()];
      var copiedText = (t && t.skills && t.skills.copied) ? t.skills.copied : "Copied";
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

  function openComingSoonModal(imageSrc, imageAlt, titleText) {
    var modal = document.getElementById("comingsoon-modal");
    var img = document.getElementById("comingsoon-image");
    var title = document.getElementById("comingsoon-title");
    if (!modal || !img || !title) return;

    title.textContent = titleText || title.textContent;
    img.alt = imageAlt || img.alt;
    img.src = imageSrc || "assets/images/join-group-claim-qr.png";
    img.onerror = function () {
      img.onerror = null;
      img.src = "assets/images/join-group-claim-qr.png";
    };

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeComingSoonModal() {
    var modal = document.getElementById("comingsoon-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function syncComingSoonModalText(t) {
    var title = document.getElementById("comingsoon-title");
    var img = document.getElementById("comingsoon-image");
    var closeBtn = document.getElementById("comingsoon-close");
    if (title && t && t.skills && t.skills.joinGroupClaimTitle) {
      title.textContent = t.skills.joinGroupClaimTitle;
    }
    if (img && t && t.skills && t.skills.joinGroupClaimImageAlt) {
      img.alt = t.skills.joinGroupClaimImageAlt;
    }
    if (closeBtn && t && t.skills && t.skills.close) {
      closeBtn.setAttribute("aria-label", t.skills.close);
      closeBtn.title = t.skills.close;
    }
  }

  function bindComingSoonModal() {
    var modal = document.getElementById("comingsoon-modal");
    if (!modal || modal.dataset.bound === "1") return;
    modal.dataset.bound = "1";
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close-comingsoon]")) {
        closeComingSoonModal();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeComingSoonModal();
    });
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

    bindComingSoonModal();
    render(lang);
  });

  window.setLang = setLang;
  window.getLang = getLang;
})();
