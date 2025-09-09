import os

# HTML template for each essay page
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} – Letters to Myself</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- Hamburger toggle -->
  <button id="nav-toggle" class="hamburger">☰ Essays</button>

  <!-- Sidebar menu (hidden by default) -->
  <nav id="nav-menu" class="hidden">
    <ul>
      {links} <!-- placeholder for links to all essays -->
    </ul>
  </nav>

  <!-- Main content -->
  <div id="main-content"></div>

  <!-- Markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="scripts/expand.js"></script>

  <script>
    window.addEventListener("DOMContentLoaded", function () {{
      const main = document.getElementById("main-content");

      fetch("content/{filename}.md")
        .then((response) => response.text())
        .then((markdown) => {{
          const html = marked.parse(markdown);
          main.innerHTML = html;
        }})
        .catch(() => {{
          main.innerText = "Failed to load essay.";
        }});

      // Simple toggle for sidebar
      const toggle = document.getElementById("nav-toggle");
      const nav = document.getElementById("nav-menu");

      toggle.addEventListener("click", () => {{
        nav.classList.toggle("visible");
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
      title = base.replace("_", " ").upper()
      if base.upper() == "OHMAN":
          # Point OHMAN to index.html instead of ohman.html
          essay_links.append(f'<li><a href="index.html">{title}</a></li>')
      else:
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
    # Update index.html navbar with links
    index_path = os.path.join(output_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            index_html = f.read()
        index_html = index_html.replace("<!-- placeholder -->", links_html)
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(index_html)
        print("✅ Updated: index.html with nav links")

if __name__ == "__main__":
    generate_html_pages()
