// scripts/expand.js
document.addEventListener("click", function (e) {
  const link = e.target.closest("a.expand-essay");
  if (!link) return;

  e.preventDefault();

  // Normalize href to a usable .md path
  let href = link.getAttribute("href") || "";

  // If no extension, add .md
  if (!/\.md(\?|#|$)/i.test(href)) href += ".md";

  // If it's a plain filename with no slash, prefix content/
  // (keeps absolute/HTTP URLs and paths with folders untouched)
  if (
    !href.startsWith("http://") &&
    !href.startsWith("https://") &&
    !href.startsWith("/") &&
    !href.includes("/")
  ) {
    href = "content/" + href;
  }

  // Create a stable container id from the normalized href
  const containerId = "exp-" + href.replace(/[^a-zA-Z0-9_-]/g, "");
  const existing = document.getElementById(containerId);

  // Toggle: if open, close it
  if (existing) {
    existing.remove();
    return;
  }

  // Otherwise, create and load
  const container = document.createElement("div");
  container.className = "expanded-essay";
  container.id = containerId;
  container.textContent = "Loading…";
  link.insertAdjacentElement("afterend", container);

  fetch(href, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      return res.text();
    })
    .then((markdown) => {
      container.innerHTML = marked.parse(markdown);
      // Remove top margin from first heading for nicer spacing
      const first = container.firstElementChild;
      if (first && /^H[1-3]$/.test(first.tagName)) first.style.marginTop = "0";
    })
    .catch((err) => {
      container.textContent = "Failed to load content: " + err.message;
    });
});
