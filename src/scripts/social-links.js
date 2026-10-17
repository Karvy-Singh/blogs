const discordButton = document.querySelector(".discord-contact");

discordButton?.addEventListener("click", async () => {
  const username = discordButton.dataset.username;

  try {
    await navigator.clipboard.writeText(username);
    discordButton.dataset.label = "Username copied";
    discordButton.classList.add("is-copied");

    window.setTimeout(() => {
      discordButton.dataset.label = username;
      discordButton.classList.remove("is-copied");
    }, 1600);
  } catch {
    discordButton.dataset.label = username;
  }
});
