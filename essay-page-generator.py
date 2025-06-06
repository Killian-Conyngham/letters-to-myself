import os

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} – Recursive Essays</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="main-content"></div>

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
    }});
  </script>
</body>
</html>
"""

def generate_html_pages(content_dir="content", output_dir="."):
    for fname in os.listdir(content_dir):
        if fname.endswith(".md"):
            base = os.path.splitext(fname)[0]
            title = base.replace("_", " ").title()

            html_content = TEMPLATE.format(title=title, filename=base)
            output_path = os.path.join(output_dir, f"{base}.html")

            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            print(f"✅ Created: {output_path}")

if __name__ == "__main__":
    generate_html_pages()
