const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const greeting = document.querySelector("#greeting");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const savedTheme = localStorage.getItem("nav-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  root.dataset.theme = "dark";
  themeMeta.content = "#0e1224";
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("nav-theme", nextTheme);
  themeMeta.content = nextTheme === "dark" ? "#0e1224" : "#eaf2ff";
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
  const greetingText = hour < 6 ? "夜深了，记得休息" : hour < 12 ? "早上好，欢迎回来" : hour < 18 ? "下午好，欢迎回来" : "晚上好，欢迎回来";
  greeting.textContent = greetingText;
  currentDate.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 1000);
