import {
  createEmptyCase,
  normalizeCase,
  validateCase,
  toExportPayload,
  fromImportPayload,
} from "./cases-core.mjs";

const STORAGE_KEY = "ima-skills-cases-v1";

const SKILLS = [
  { slug: "ima-all-ai", name: "IMA Studio" },
  { slug: "ima-image-ai", name: "IMA 图像生成" },
  { slug: "ima-video-ai", name: "IMA 视频生成" },
  { slug: "ima-voice-ai", name: "IMA 音乐生成" },
  { slug: "ima-tts-ai", name: "IMA TTS" },
  { slug: "ima-knowledge-ai", name: "IMA Knowledge AI" },
  { slug: "ai-nano-banana-ima", name: "IMA Nano Banana" },
  { slug: "fairytale-picturebook-pro", name: "绘本漫画（场景技能）" },
];

const state = {
  cases: [],
  editingId: "",
  keyword: "",
  skill: "all",
  status: "all",
};

function $(id) {
  return document.getElementById(id);
}

function loadCases() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeCase);
    }
    return fromImportPayload(parsed);
  } catch (_) {
    return [];
  }
}

function saveCases() {
  const payload = toExportPayload(state.cases);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("zh-CN", { hour12: false });
}

function getSkillName(slug) {
  const found = SKILLS.find((item) => item.slug === slug);
  return found ? found.name : slug;
}

function renderSkillOptions() {
  const filterSkill = $("filter-skill");
  const formSkill = $("case-skill-slug");
  const options = SKILLS.map(
    (s) => `<option value="${escapeHtml(s.slug)}">${escapeHtml(s.name)}</option>`
  ).join("");

  filterSkill.insertAdjacentHTML("beforeend", options);
  formSkill.insertAdjacentHTML("beforeend", options);
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
}

function renderErrors(errors) {
  clearErrors();
  Object.keys(errors).forEach((field) => {
    const errorNode = document.querySelector(`[data-error-for="${field}"]`);
    if (errorNode) {
      errorNode.textContent = errors[field];
    }
  });
}

function fillForm(c) {
  $("case-skill-slug").value = c.skillSlug;
  $("case-title").value = c.title;
  $("case-summary").value = c.summary;
  $("case-tags").value = c.tags;
  $("case-demo-url").value = c.demoUrl;
  $("case-repo-url").value = c.repoUrl;
  $("case-status").value = c.status;
}

function resetForm() {
  state.editingId = "";
  $("form-title").textContent = "新建案例";
  fillForm(createEmptyCase());
  clearErrors();
}

function getFilteredCases() {
  const keyword = state.keyword.toLowerCase();

  return state.cases.filter((c) => {
    if (state.skill !== "all" && c.skillSlug !== state.skill) return false;
    if (state.status !== "all" && c.status !== state.status) return false;

    if (!keyword) return true;

    const haystack = [c.title, c.summary, c.tags, c.skillSlug]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}

function renderStats(filteredCount) {
  const published = state.cases.filter((x) => x.status === "published").length;
  $("manage-stats").textContent =
    `总计 ${state.cases.length} 条案例，已发布 ${published} 条，当前筛选 ${filteredCount} 条`;
}

function renderList() {
  const tbody = $("cases-tbody");
  const rows = getFilteredCases();
  $("cases-empty").style.display = rows.length === 0 ? "block" : "none";
  tbody.innerHTML = rows
    .map((c) => {
      const safeTitle = escapeHtml(c.title);
      const safeSkill = escapeHtml(getSkillName(c.skillSlug));
      const safeStatus = c.status === "published" ? "已发布" : "草稿";
      const statusClass =
        c.status === "published" ? "status-published" : "status-draft";
      return (
        "<tr>" +
        `<td><div class="case-title">${safeTitle}</div><div class="case-summary">${escapeHtml(c.summary)}</div></td>` +
        `<td>${safeSkill}</td>` +
        `<td><span class="status-pill ${statusClass}">${safeStatus}</span></td>` +
        `<td>${escapeHtml(formatDate(c.updatedAt))}</td>` +
        `<td class="row-actions">` +
        `<button type="button" data-action="edit" data-id="${escapeHtml(c.id)}">编辑</button>` +
        `<button type="button" data-action="delete" data-id="${escapeHtml(c.id)}" class="danger">删除</button>` +
        "</td>" +
        "</tr>"
      );
    })
    .join("");

  renderStats(rows.length);
}

function upsertCase(nextCase) {
  const index = state.cases.findIndex((item) => item.id === nextCase.id);
  if (index >= 0) {
    state.cases[index] = nextCase;
  } else {
    state.cases.unshift(nextCase);
  }

  state.cases.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function readFormData() {
  const next = normalizeCase({
    id: state.editingId || undefined,
    skillSlug: $("case-skill-slug").value,
    title: $("case-title").value,
    summary: $("case-summary").value,
    tags: $("case-tags").value,
    demoUrl: $("case-demo-url").value,
    repoUrl: $("case-repo-url").value,
    status: $("case-status").value,
    updatedAt: new Date().toISOString(),
  });
  return next;
}

function onSaveCase(event) {
  event.preventDefault();
  const next = readFormData();
  const errors = validateCase(next);

  if (Object.keys(errors).length > 0) {
    renderErrors(errors);
    return;
  }

  upsertCase(next);
  saveCases();
  renderList();
  resetForm();
}

function onTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.getAttribute("data-action");
  const id = button.getAttribute("data-id");
  const target = state.cases.find((item) => item.id === id);
  if (!target) return;

  if (action === "edit") {
    state.editingId = target.id;
    $("form-title").textContent = "编辑案例";
    fillForm(target);
    clearErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (action === "delete") {
    const ok = window.confirm(`确认删除案例「${target.title}」吗？`);
    if (!ok) return;
    state.cases = state.cases.filter((item) => item.id !== id);
    saveCases();
    renderList();
    if (state.editingId === id) {
      resetForm();
    }
  }
}

function onExport() {
  const payload = toExportPayload(state.cases);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ima-skill-cases-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function onImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || ""));
      state.cases = fromImportPayload(payload);
      saveCases();
      renderList();
      resetForm();
    } catch (err) {
      window.alert(`导入失败：${err.message}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

function onClearAll() {
  if (state.cases.length === 0) return;
  const ok = window.confirm("确认清空全部案例吗？此操作不可撤销。");
  if (!ok) return;

  state.cases = [];
  saveCases();
  renderList();
  resetForm();
}

function bindEvents() {
  $("case-form").addEventListener("submit", onSaveCase);
  $("cases-tbody").addEventListener("click", onTableAction);

  $("btn-new").addEventListener("click", resetForm);
  $("btn-cancel-edit").addEventListener("click", resetForm);
  $("btn-export").addEventListener("click", onExport);
  $("import-file").addEventListener("change", onImport);
  $("btn-clear").addEventListener("click", onClearAll);

  $("case-search").addEventListener("input", (event) => {
    state.keyword = event.target.value.trim();
    renderList();
  });
  $("filter-skill").addEventListener("change", (event) => {
    state.skill = event.target.value;
    renderList();
  });
  $("filter-status").addEventListener("change", (event) => {
    state.status = event.target.value;
    renderList();
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function bootstrap() {
  renderSkillOptions();
  state.cases = loadCases();
  bindEvents();
  resetForm();
  renderList();
}

document.addEventListener("DOMContentLoaded", bootstrap);
