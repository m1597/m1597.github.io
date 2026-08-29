const STORAGE = {
  engine: "m1597-search-engine",
  recent: "m1597-recent-links",
  links: "m1597-link-overrides"
};
const ZONES = ["search", "daily", "inspiration", "learning", "rest"];
const ENGINE_URLS = {
  bing: "https://www.bing.com/search?q=",
  google: "https://www.google.com/search?q=",
  baidu: "https://www.baidu.com/s?wd=",
  duckduckgo: "https://duckduckgo.com/?q="
};

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const searchEngine = document.querySelector("#searchEngine");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const recentLinks = document.querySelector("#recentLinks");
const clearRecent = document.querySelector("#clearRecent");
const manager = document.querySelector("#linkManager");
const linkEditor = document.querySelector("#linkEditor");
const linkChoice = document.querySelector("#linkChoice");
const linkName = document.querySelector("#linkName");
const linkDescription = document.querySelector("#linkDescription");
const linkUrl = document.querySelector("#linkUrl");
const toast = document.querySelector("#toast");
const managedLinks = [...document.querySelectorAll("[data-link-key]")];
let toastTimer;

function readValue(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writeValue(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
function removeValue(key) {
  try { localStorage.removeItem(key); } catch { /* Storage may be blocked in private mode. */ }
}
function readJSON(key, fallback) {
  try { return JSON.parse(readValue(key)) ?? fallback; } catch { return fallback; }
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
function openExternal(url) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
}

searchEngine.value = readValue(STORAGE.engine, "bing");
searchEngine.addEventListener("change", () => writeValue(STORAGE.engine, searchEngine.value));
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    searchInput.focus();
    showToast("先输入想搜索的内容");
    return;
  }
  openExternal(`${ENGINE_URLS[searchEngine.value]}${encodeURIComponent(query)}`);
});

document.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  if (event.key === "/" && !isTyping && !manager.open) {
    event.preventDefault();
    document.querySelector("#search").scrollIntoView({ behavior: "smooth" });
    searchInput.focus({ preventScroll: true });
  }
  if (event.altKey && /^[1-5]$/.test(event.key) && !manager.open) {
    event.preventDefault();
    document.querySelector(`#${ZONES[Number(event.key) - 1]}`)?.scrollIntoView({ behavior: "smooth" });
  }
  if (event.key === "Escape" && manager.open) manager.close();
});

function updateClock() {
  const now = new Date();
  currentDate.textContent = new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", weekday: "short" }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  document.querySelector(".header-time").dateTime = now.toISOString();
}
document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 30000);

function setActiveZone(zoneId) {
  document.querySelectorAll("[data-zone-link]").forEach((link) => {
    if (link.dataset.zoneLink === zoneId) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
const zoneObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  if (visible[0]) setActiveZone(visible[0].target.id);
}, { rootMargin: "-28% 0px -55%", threshold: [0, .1, .3, .6] });
document.querySelectorAll("[data-zone]").forEach((zone) => zoneObserver.observe(zone));

function getLinkData(link) {
  return {
    key: link.dataset.linkKey,
    name: link.querySelector("b").textContent,
    description: link.querySelector("small").textContent,
    url: link.href,
    category: link.closest("[data-category]").dataset.category
  };
}
const originalLinks = Object.fromEntries(managedLinks.map((link) => [link.dataset.linkKey, getLinkData(link)]));
function applyLink(link, data) {
  link.href = data.url;
  link.querySelector("b").textContent = data.name;
  link.querySelector("small").textContent = data.description;
  link.querySelector("em").textContent = [...data.name][0]?.toUpperCase() || "·";
  link.setAttribute("aria-label", `${data.name}：${data.description}，在新窗口打开`);
}
function applySavedLinks() {
  const overrides = readJSON(STORAGE.links, {});
  managedLinks.forEach((link) => applyLink(link, overrides[link.dataset.linkKey] || originalLinks[link.dataset.linkKey]));
}

function renderRecent() {
  const recent = readJSON(STORAGE.recent, []).slice(0, 4);
  recentLinks.replaceChildren();
  clearRecent.hidden = recent.length === 0;
  if (!recent.length) {
    const empty = document.createElement("p");
    empty.className = "recent-empty";
    empty.textContent = "打开下方链接后，这里会记录最近使用的网站。";
    recentLinks.append(empty);
    return;
  }
  recent.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${item.name} ↗`;
    link.addEventListener("click", () => recordRecent(item));
    recentLinks.append(link);
  });
}
function recordRecent(item) {
  const recent = readJSON(STORAGE.recent, []).filter((entry) => entry.url !== item.url);
  recent.unshift({ name: item.name, url: item.url });
  writeValue(STORAGE.recent, JSON.stringify(recent.slice(0, 4)));
  renderRecent();
}
managedLinks.forEach((link) => link.addEventListener("click", () => recordRecent(getLinkData(link))));
clearRecent.addEventListener("click", () => {
  removeValue(STORAGE.recent);
  renderRecent();
  showToast("最近访问已清空");
});

function fillLinkEditor() {
  const link = document.querySelector(`[data-link-key="${linkChoice.value}"]`);
  if (!link) return;
  const data = getLinkData(link);
  linkName.value = data.name;
  linkDescription.value = data.description;
  linkUrl.value = data.url;
}
function buildLinkChoices(selectedKey) {
  linkChoice.replaceChildren();
  managedLinks.forEach((link) => {
    const data = getLinkData(link);
    const option = document.createElement("option");
    option.value = data.key;
    option.textContent = `${data.category} / ${data.name}`;
    linkChoice.append(option);
  });
  if (selectedKey) linkChoice.value = selectedKey;
  fillLinkEditor();
}
document.querySelectorAll("[data-open-manager]").forEach((button) => button.addEventListener("click", () => {
  buildLinkChoices();
  manager.showModal();
}));
document.querySelector("[data-close-manager]").addEventListener("click", () => manager.close());
manager.addEventListener("click", (event) => { if (event.target === manager) manager.close(); });
linkChoice.addEventListener("change", fillLinkEditor);

linkEditor.addEventListener("submit", (event) => {
  event.preventDefault();
  let parsed;
  try {
    parsed = new URL(linkUrl.value);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch {
    linkUrl.setCustomValidity("请输入以 http:// 或 https:// 开头的有效网址");
    linkUrl.reportValidity();
    return;
  }
  linkUrl.setCustomValidity("");
  const editedKey = linkChoice.value;
  const overrides = readJSON(STORAGE.links, {});
  overrides[editedKey] = { ...originalLinks[editedKey], name: linkName.value.trim(), description: linkDescription.value.trim(), url: parsed.href };
  if (!writeValue(STORAGE.links, JSON.stringify(overrides))) {
    showToast("浏览器阻止了本地保存");
    return;
  }
  applySavedLinks();
  buildLinkChoices(editedKey);
  showToast("链接修改已保存在当前浏览器");
});
document.querySelector("#resetLink").addEventListener("click", () => {
  const key = linkChoice.value;
  const overrides = readJSON(STORAGE.links, {});
  delete overrides[key];
  writeValue(STORAGE.links, JSON.stringify(overrides));
  applySavedLinks();
  buildLinkChoices(key);
  showToast("当前链接已恢复默认");
});
document.querySelector("#resetAllLinks").addEventListener("click", () => {
  removeValue(STORAGE.links);
  applySavedLinks();
  buildLinkChoices();
  showToast("全部链接已恢复默认");
});

applySavedLinks();
renderRecent();
