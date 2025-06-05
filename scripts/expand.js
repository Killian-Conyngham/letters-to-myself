document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a.expand-essay').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = e.target.getAttribute('href');
      const container = document.createElement('div');
      container.classList.add('expanded-essay');
      container.innerHTML = "<em>Loading...</em>";
      e.target.parentElement.appendChild(container);
      try {
        const res = await fetch("/content/" + url);
        const md = await res.text();
        container.innerHTML = marked.parse(md);
      } catch (err) {
        container.innerHTML = "<strong>Error loading essay.</strong>";
      }
    });
  });
});
