const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const slides = [...document.querySelectorAll(".art-slide")];
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

function selectSlide(selected) {
  slides.forEach((slide) => {
    const active = slide === selected;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-pressed", String(active));
  });
}

slides.forEach((slide) => slide.addEventListener("click", () => selectSlide(slide)));

function updateClock() {
  const now = new Date();
  currentDate.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#groupCount").textContent = document.querySelectorAll(".directory-group").length;
document.querySelector("#linkCount").textContent = document.querySelectorAll(".directory-group nav a").length;
updateClock();
setInterval(updateClock, 30000);
