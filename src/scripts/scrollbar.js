const scrollbar = document.createElement("div");
const scrollbarThumb = document.createElement("div");
let updateFrame;

document.documentElement.classList.add("has-custom-scrollbar");
scrollbar.className = "page-scrollbar";
scrollbar.setAttribute("aria-hidden", "false");
scrollbarThumb.className = "page-scrollbar-thumb";
scrollbarThumb.tabIndex = 0;
scrollbarThumb.setAttribute("role", "scrollbar");
scrollbarThumb.setAttribute("aria-controls", "page-content");
scrollbarThumb.setAttribute("aria-orientation", "vertical");
scrollbar.append(scrollbarThumb);
document.body.append(scrollbar);

function getMetrics() {
  const trackHeight = scrollbar.clientHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const maxScroll = Math.max(0, documentHeight - window.innerHeight);
  const naturalHeight = trackHeight * (window.innerHeight / documentHeight);
  const thumbHeight = Math.max(48, naturalHeight * 0.62);
  const maxThumbTop = Math.max(0, trackHeight - thumbHeight);

  return { maxScroll, maxThumbTop, thumbHeight };
}

function updateScrollbar() {
  updateFrame = undefined;
  const { maxScroll, maxThumbTop, thumbHeight } = getMetrics();
  scrollbar.hidden = maxScroll <= 0;

  if (maxScroll <= 0) return;

  const thumbTop = (window.scrollY / maxScroll) * maxThumbTop;
  scrollbarThumb.style.height = `${thumbHeight}px`;
  scrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
  scrollbarThumb.setAttribute("aria-valuemin", "0");
  scrollbarThumb.setAttribute("aria-valuemax", String(Math.round(maxScroll)));
  scrollbarThumb.setAttribute("aria-valuenow", String(Math.round(window.scrollY)));
}

function scheduleUpdate() {
  if (!updateFrame) updateFrame = requestAnimationFrame(updateScrollbar);
}

scrollbarThumb.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  scrollbarThumb.setPointerCapture(event.pointerId);

  const startY = event.clientY;
  const startScroll = window.scrollY;
  const { maxScroll, maxThumbTop } = getMetrics();

  function drag(moveEvent) {
    const scrollDelta = (moveEvent.clientY - startY) * (maxScroll / maxThumbTop);
    window.scrollTo(0, startScroll + scrollDelta);
  }

  function stopDrag() {
    scrollbarThumb.removeEventListener("pointermove", drag);
    scrollbarThumb.removeEventListener("pointerup", stopDrag);
    scrollbarThumb.removeEventListener("pointercancel", stopDrag);
  }

  scrollbarThumb.addEventListener("pointermove", drag);
  scrollbarThumb.addEventListener("pointerup", stopDrag);
  scrollbarThumb.addEventListener("pointercancel", stopDrag);
});

scrollbar.addEventListener("pointerdown", (event) => {
  if (event.target === scrollbarThumb) return;

  const { maxScroll, maxThumbTop, thumbHeight } = getMetrics();
  const trackTop = scrollbar.getBoundingClientRect().top;
  const requestedTop = event.clientY - trackTop - thumbHeight / 2;
  const thumbTop = Math.min(maxThumbTop, Math.max(0, requestedTop));
  window.scrollTo({ top: (thumbTop / maxThumbTop) * maxScroll, behavior: "smooth" });
});

scrollbarThumb.addEventListener("keydown", (event) => {
  const keyActions = {
    ArrowDown: () => window.scrollBy({ top: 80 }),
    ArrowUp: () => window.scrollBy({ top: -80 }),
    PageDown: () => window.scrollBy({ top: window.innerHeight * 0.85 }),
    PageUp: () => window.scrollBy({ top: -window.innerHeight * 0.85 }),
    Home: () => window.scrollTo({ top: 0 }),
    End: () => window.scrollTo({ top: document.documentElement.scrollHeight })
  };

  if (!keyActions[event.key]) return;
  event.preventDefault();
  keyActions[event.key]();
});

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
new ResizeObserver(scheduleUpdate).observe(document.body);
updateScrollbar();
