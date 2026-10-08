const themePicker = document.querySelector(".theme-picker");
const themeSummary = themePicker?.querySelector("summary");
const themeButtons = [...document.querySelectorAll(".theme-option")];
const themeNames = {
  parchment: "Parchment",
  rose: "Berry",
  sage: "Mint",
  mist: "Periwinkle",
  lilac: "Lilac"
};

function applyTheme(theme) {
  if (theme === "parchment") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  try {
    localStorage.setItem("color-theme", theme);
  } catch {}

  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
  });

  if (themeSummary) {
    themeSummary.setAttribute("aria-label", `Color theme: ${themeNames[theme]}`);
    themeSummary.title = `Color theme: ${themeNames[theme]}`;
  }
}

const selectedTheme = document.documentElement.dataset.theme || "parchment";
applyTheme(selectedTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    themePicker.removeAttribute("open");
  });
});

document.addEventListener("click", (event) => {
  if (themePicker?.open && !themePicker.contains(event.target)) {
    themePicker.removeAttribute("open");
  }
});
