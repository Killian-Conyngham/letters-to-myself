document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("main-content");

  contentDiv.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("expand-essay")) {
      e.preventDefault();
      const link = e.target;
      const url = link.getAttribute("href");

      // Avoid loading the same essay multiple times
      if (link.dataset.loaded === "true") return;

      const container = document.createElement("div");
      container.classList.add("expanded-essay");
      container.innerText = "Loading...";
      link.insertAdjacentElement("afterend", container);

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((markdown) => {
          const html = marked.parse(markdown);
          container.innerHTML = html;
          link.dataset.loaded = "true";

          // Enable recursive expansion within loaded content
          container.querySelectorAll("a.expand-essay").forEach((a) => {
            a.addEventListener("click", function (e) {
              e.preventDefault();
              if (a.dataset.loaded === "true") return;
              const nestedContainer = document.createElement("div");
              nestedContainer.classList.add("expanded-essay");
              nestedContainer.innerText = "Loading...";
              a.insertAdjacentElement("afterend", nestedContainer);

              fetch(a.getAttribute("href"))
                .then((res) => res.text())
                .then((md) => {
                  nestedContainer.innerHTML = marked.parse(md);
                  a.dataset.loaded = "true";
                })
                .catch(() => {
                  nestedContainer.innerText = "Failed to load content.";
                });
            });
          });
        })
        .catch(() => {
          container.innerText = "Failed to load content.";
        });
    }
  });
});
