let navigationController;

function isPageLink(url) {
  if (url.origin !== window.location.origin) return false;
  if (url.pathname.endsWith(".xml")) return false;

  return url.pathname === "/" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html");
}

function scrollToDestination(url) {
  if (url.hash) {
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target) {
      target.scrollIntoView();
      return;
    }
  }

  window.scrollTo({ top: 0, left: 0 });
}

async function navigate(url, pushState) {
  navigationController?.abort();
  navigationController = new AbortController();

  const currentMain = document.querySelector("main");
  currentMain.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      signal: navigationController.signal
    });
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok || !contentType.includes("text/html")) {
      throw new Error(`Unable to load ${url}`);
    }

    const html = await response.text();
    const nextDocument = new DOMParser().parseFromString(html, "text/html");
    const nextMain = nextDocument.querySelector("main");

    if (!nextMain) throw new Error(`No main content found at ${url}`);

    document.title = nextDocument.title;
    const currentDescription = document.querySelector('meta[name="description"]');
    const nextDescription = nextDocument.querySelector('meta[name="description"]');
    if (currentDescription && nextDescription) {
      currentDescription.content = nextDescription.content;
    }

    currentMain.replaceWith(nextMain);
    window.enhanceCodeBlocks?.(nextMain);

    if (pushState) history.pushState({}, "", url);
    scrollToDestination(url);

    nextMain.tabIndex = -1;
    nextMain.focus({ preventScroll: true });
  } catch (error) {
    if (error.name === "AbortError") return;
    window.location.assign(url);
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.target || link.hasAttribute("download")) return;

  const url = new URL(link.href, window.location.href);
  if (!isPageLink(url)) return;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return;

  event.preventDefault();
  navigate(url, true);
});

window.addEventListener("popstate", () => {
  navigate(new URL(window.location.href), false);
});
