document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("expand-essay")) {
    e.preventDefault();

    const link = e.target;
    const href = link.getAttribute("href");
    const containerId = "container-" + href.replace(/[^a-zA-Z0-9]/g, "");
    let existing = document.getElementById(containerId);

    if (existing) {
      // Already expanded — collapse it
      existing.remove();
      return;
    }

    // Otherwise, expand
    const newDiv = document.createElement("div");
    newDiv.className = "expanded-essay";
    newDiv.id = containerId;
    newDiv.innerHTML = "<p>Loading...</p>";
    link.insertAdjacentElement("afterend", newDiv);

    fetch("content/" + href + ".md")
      .then((response) => response.text())
      .then((markdown) => {
        newDiv.innerHTML = marked.parse(markdown);
      })
      .catch(() => {
        newDiv.innerHTML = "<p>Failed to load content.</p>";
      });
  }
});
