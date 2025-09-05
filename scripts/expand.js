// scripts/expand.js
document.addEventListener("click", function (e) {
  const link = e.target.closest("a.expand-essay");
  if (!link) return;

  e.preventDefault();

  const url = link.getAttribute("href");
  let container = link.nextElementSibling;

  // Create container if not already there
  if (!container || !container.classList.contains("expanded-essay")) {
    container = document.createElement("div");
    container.className = "expanded-essay";
    link.insertAdjacentElement("afterend", container);
  }

  // Toggle collapse
  if (container.dataset.loaded === "true") {
    container.innerHTML = "";
    container.dataset.loaded = "false";
    return;
  }

  container.innerHTML = "<em>Loading…</em>";

  fetch(url, { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then(md => {
      const html = marked.parse(md);
      container.innerHTML = html;
      container.dataset.loaded = "true";
    })
    .catch(() => {
      container.innerHTML = "<em>Failed to load content.</em>";
    });
});
