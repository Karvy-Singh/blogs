function normalizeSearchText(value) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function editDistance(first, second) {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
  const current = new Array(second.length + 1);

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    current[0] = firstIndex;

    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const substitution = previous[secondIndex - 1] +
        (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1);

      current[secondIndex] = Math.min(
        previous[secondIndex] + 1,
        current[secondIndex - 1] + 1,
        substitution
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[second.length];
}

function fuzzyWordMatch(queryWord, textWords) {
  const tolerance = queryWord.length >= 7 ? 2 : queryWord.length >= 4 ? 1 : 0;

  return textWords.some((word) =>
    word.includes(queryWord) ||
    (tolerance > 0 && Math.abs(word.length - queryWord.length) <= tolerance &&
      editDistance(queryWord, word) <= tolerance)
  );
}

function matchesSearch(query, text) {
  if (!query || text.includes(query)) return true;

  const textWords = text.split(" ");
  return query.split(" ").every((word) => fuzzyWordMatch(word, textWords));
}

function enhanceWritingIndex(root = document) {
  const filters = root.querySelector(".writing-filters");
  if (!filters || filters.dataset.enhanced) return;

  const search = filters.querySelector("input[type='search']");
  const topicFilter = filters.querySelector(".topic-filter");
  const topicLabel = topicFilter.querySelector("summary span");
  const categoryOptions = [...topicFilter.querySelectorAll("[data-category]")];
  const posts = [...root.querySelectorAll(".writing-list > article")].map((element) => ({
    element,
    searchText: normalizeSearchText([
      element.querySelector("h2")?.textContent || "",
      element.querySelector("p")?.textContent || ""
    ].join(" ")),
    categories: (element.dataset.categories || "")
      .split("|")
      .map(normalizeSearchText)
  }));
  let selectedCategory = "all";

  function updateResults() {
    const query = normalizeSearchText(search.value);

    posts.forEach((post) => {
      const matchesCategory = selectedCategory === "all" ||
        post.categories.includes(selectedCategory);
      const visible = matchesCategory && matchesSearch(query, post.searchText);
      post.element.hidden = !visible;
    });
  }

  search.addEventListener("input", updateResults);
  categoryOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectedCategory = normalizeSearchText(option.dataset.category);
      topicLabel.textContent = option.textContent;
      categoryOptions.forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      topicFilter.open = false;
      updateResults();
    });
  });

  topicFilter.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      topicFilter.open = false;
      topicFilter.querySelector("summary").focus();
    }
  });

  filters.dataset.enhanced = "true";
  filters.hidden = false;
  updateResults();
}

window.enhanceWritingIndex = enhanceWritingIndex;
enhanceWritingIndex();
