const languageNames = {
  bash: "Shell",
  c: "C",
  cpp: "C++",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  kotlin: "Kotlin",
  markup: "HTML",
  php: "PHP",
  py: "Python",
  python: "Python",
  sh: "Shell",
  sql: "SQL",
  ts: "TypeScript",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML"
};

function getLanguage(pre, code) {
  const languageClass = [...pre.classList, ...code.classList].find((name) =>
    name.startsWith("language-")
  );

  return languageClass ? languageClass.slice("language-".length) : "text";
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

document.querySelectorAll('pre[class*="language-"]').forEach((pre) => {
  const code = pre.querySelector("code");
  if (!code || pre.parentElement.classList.contains("code-block")) return;

  const language = getLanguage(pre, code);
  const wrapper = document.createElement("div");
  const toolbar = document.createElement("div");
  const label = document.createElement("span");
  const button = document.createElement("button");

  wrapper.className = "code-block";
  toolbar.className = "code-toolbar";
  label.className = "code-language";
  label.textContent = languageNames[language] || language.toUpperCase();
  button.className = "code-copy";
  button.type = "button";
  button.textContent = "Copy";
  button.setAttribute("aria-label", `Copy ${label.textContent} code`);

  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        fallbackCopy(code.textContent);
      } else {
        await navigator.clipboard.writeText(code.textContent);
      }

      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    } catch {
      button.textContent = "Copy failed";
    }
  });

  toolbar.append(label, button);
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.append(toolbar, pre);
});
