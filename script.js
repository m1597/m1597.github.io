const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");

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
  currentDate.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 30000);
