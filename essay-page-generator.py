# essay-page-generator.py
import os

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} – Letters to Myself</title>
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <button id="nav-toggle">☰ Essays</button>
  <nav id="nav-menu">
    <h2>All Essays</h2>
    <ul>
      {links}
    </ul>
  </nav>

  <div id="main-content"></div>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="../scripts/expand.js"></script>
  <script>
    window.addEventListener("DOMContentLoaded", function () {{
      const main = document.getElementById("main-content");

      fetch("../essays/{filename}.md")
        .then((response) => response.text())
        .then((markdown) => {{
          const html = marked.parse(markdown);
          main.innerHTML = html;
        }})
        .catch(() => {{
          main.innerText = "Failed to load essay.";
        }});

      // Navigation toggle
      const toggle = document.getElementById("nav-toggle");
      const menu = document.getElementById("nav-menu");
      toggle.addEventListener("click", function () {{
        menu.classList.toggle("open");
      }});
    }});
  </script>
</body>
</html>
"""

def generate_html_pages(essays_dir="content", output_dir="."):
    os.makedirs(output_dir, exist_ok=True)

    # gather and sort essay filenames
    essay_files = sorted([f for f in os.listdir(essays_dir) if f.endswith(".md")])

    if not essay_files:
        print("No .md files found in", essays_dir)
        return

    # For each essay, build a sidebar links HTML that highlights (non-link) the current essay
    for fname in essay_files:
        base = os.path.splitext(fname)[0]
        title = base.replace("_", " ").upper()

        # build links HTML for this page (exclude self or render as bold)
        links_items = []
        for f in essay_files:
            name = os.path.splitext(f)[0]
            pretty = name.replace("_", " ").title()
            if name == base:
                links_items.append(f'<li><strong>{pretty}</strong></li>')
            else:
                links_items.append(f'<li><a href="{name}.html">{pretty}</a></li>')
        links_html = "\n      ".join(links_items)

        html_content = TEMPLATE.format(title=title, filename=base, links=links_html)
        output_path = os.path.join(output_dir, f"{base}.html")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"✅ Created: {output_path}")

if __name__ == "__main__":
    generate_html_pages()

