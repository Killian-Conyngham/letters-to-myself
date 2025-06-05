document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("main-content");

  contentDiv.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("expand-essay")) {
      e.preventDefault();

      const link = e.target;
      const url = link.getAttribute("href");

      // Prevent duplicate loads
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
        })
        .catch(() => {
          container.innerText = "Failed to load content.";
        });
    }
  });
});
