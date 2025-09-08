import os

# HTML template for each essay page
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} – Recursive Essays</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="page-container">
    <button id="nav-toggle">☰ Essays</button>

    <nav id="nav-menu" class="hidden">
      <h2>All Essays</h2>
      <ul>
        {links}
      </ul>
    </nav>

    <main id="main-content"></main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="scripts/expand.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {{
      const main = document.getElementById("main-content");

      fetch("content/{filename}.md")
        .then(res => res.text())
        .then(md => main.innerHTML = marked.parse(md))
        .catch(() => main.innerText = "Failed to load essay.");

      const navToggle = document.getElementById("nav-toggle");
      const navMenu = document.getElementById("nav-menu");

      navToggle.addEventListener("click", () => {{
        navMenu.classList.toggle("hidden");
      }});
    }});
  </script>
</body>
</html>
"""

def generate_html_pages(content_dir="content", output_dir="."):
    # Collect all essay filenames
    essays = [f for f in os.listdir(content_dir) if f.endswith(".md")]
    essay_links = []

    # Prepare nav links
    for fname in essays:
        base = os.path.splitext(fname)[0]
        title = base.replace("_", " ").title()
        essay_links.append(f'<li><a href="{base}.html">{title}</a></li>')

    links_html = "\n        ".join(essay_links)

    # Generate an HTML page for each essay
    for fname in essays:
        base = os.path.splitext(fname)[0]
        title = base.replace("_", " ").upper()

        html_content = TEMPLATE.format(title=title, filename=base, links=links_html)
        output_path = os.path.join(output_dir, f"{base}.html")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"✅ Created: {output_path}")

if __name__ == "__main__":
    generate_html_pages()

