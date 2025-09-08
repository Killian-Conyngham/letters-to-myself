// scripts/expand.js
(function () {
  // helper: add .md if missing (but leave view.html and absolute urls alone)
  function normalizeMdPath(href) {
    if (!href) return href;
    href = href.trim();
    // allow view.html?file=... and absolute URLs, and anchors
    if (href.startsWith("view.html") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/") || href.startsWith("#")) {
      return href;
    }
    // add .md if missing
    if (!/\.md($|\?|#)/i.test(href)) href = href + ".md";
    return href;
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    return await res.text();
  }

  document.addEventListener("click", function (e) {
    // 1) Click on preview-trigger links inside essays: <a class="expand-essay" href="previews/FOO.md">
    const previewLink = e.target.closest("a.expand-essay");
    if (previewLink) {
      e.preventDefault();
      const rawHref = previewLink.getAttribute("href") || "";
      const href = normalizeMdPath(rawHref); // likely "previews/FOO.md"
      // find or create container directly after the clicked link
      let container = previewLink.nextElementSibling;
      if (!container || !container.classList.contains("expanded-essay")) {
        container = document.createElement("div");
        container.className = "expanded-essay";
        previewLink.insertAdjacentElement("afterend", container);
      } else {
        // toggle: if it's already showing the same preview, remove it
        if (container.dataset.loaded === href && container.dataset.type === "preview") {
          container.remove();
          return;
        }
      }

      container.textContent = "Loading preview…";
      fetchText(href)
        .then((md) => {
          container.innerHTML = marked.parse(md);
          container.dataset.loaded = href;
          container.dataset.type = "preview";
        })
        .catch((err) => {
          container.textContent = "Failed to load preview: " + err.message;
        });
      return;
    }

    // 2) Click on "expand full" inside a preview: <a class="expand-full" href="essays/FOO.md">
    const expandFull = e.target.closest("a.expand-full");
    if (expandFull) {
      e.preventDefault();
      const rawHref = expandFull.getAttribute("href") || "";
      const href = normalizeMdPath(rawHref); // likely "essays/FOO.md"
      // find the preview container to replace: prefer nearest .expanded-essay, then .essay-container, else fallback to parent
      let container = expandFull.closest(".expanded-essay") || expandFull.closest(".essay-container") || expandFull.parentElement;
      if (!container) container = document.getElementById("main-content") || document.body;

      // if already full and same source, toggle back to preview (if preview stored)
      if (container.dataset.type === "full" && container.dataset.fullSrc === href) {
        if (container.dataset.previewHtml) {
          container.innerHTML = container.dataset.previewHtml;
          container.dataset.type = "preview";
          container.dataset.fullSrc = "";
        } else {
          // no preview stored -> just remove container
          container.remove();
        }
        return;
      }

      // save preview html so we can toggle back
      container.dataset.previewHtml = container.innerHTML;
      container.textContent = "Loading full essay…";

      fetchText(href)
        .then((md) => {
          container.innerHTML = marked.parse(md);
          container.dataset.type = "full";
          container.dataset.fullSrc = href;
        })
        .catch((err) => {
          container.textContent = "Failed to load full essay: " + err.message;
        });

      return;
    }

    // otherwise, let default behavior occur (e.g., links that open in new tab)
  });
})();

// Hamburger toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-menu");
  const main = document.getElementById("main-content");

  if (toggle && nav && main) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("visible");
      main.classList.toggle("shifted");
      toggle.classList.toggle("active");
    });
  }
});
