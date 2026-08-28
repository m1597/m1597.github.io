const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector("#themeLabel");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const greeting = document.querySelector("#greeting");

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeLabel.textContent = theme === "dark" ? "晴空" : "夜航";
  themeToggle.querySelector("span").textContent = theme === "dark" ? "☀" : "☾";
  themeMeta.content = theme === "dark" ? "#082b4a" : "#079ff0";
}

const savedTheme = localStorage.getItem("sky-theme");
const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("sky-theme", nextTheme);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  greeting.textContent = hour < 6 ? "夜还很长" : hour < 12 ? "早上好，欢迎回来" : hour < 18 ? "下午好，欢迎回来" : "晚上好，欢迎回来";
  currentDate.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 1000);
