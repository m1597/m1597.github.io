const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const currentDate = document.querySelector("#currentDate");
const currentTime = document.querySelector("#currentTime");
const railLinks = [...document.querySelectorAll(".chapter-rail a")];

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    railLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
  });
}, { threshold: .55 });

document.querySelectorAll(".observe").forEach((section) => observer.observe(section));
document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 30000);
