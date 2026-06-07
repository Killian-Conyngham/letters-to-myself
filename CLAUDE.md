# Letters to Myself

A personal essay collection with an interactive, non-linear reading experience. Readers can expand essay previews inline or open them in a new tab, letting ideas interrelate across multiple essays in a single sitting.

## Stack

Static site — no build tooling, no package manager.

- **Content:** Markdown (`content/`, `previews/`)
- **Presentation:** Hand-authored HTML per essay + shared `styles.css`
- **Interactivity:** `scripts/expand.js` (vanilla JS, handles inline preview/full expansion)
- **Markdown parsing:** `static/marked.min.js` (bundled, no CDN dependency for local use)
- **HTML generation:** `essay-page-generator.py` (Python, run manually)
- **Hosting:** GitHub Pages

## Directory structure

```
content/          Full essay markdown files
content/alt_endings/  Alternative ending variants (currently OHMAN only)
previews/         Truncated preview snippets (~usually last 500 words, prefixed with "[...]")
wip/              Drafts and graveyard content — not published
scripts/          expand.js — interactive expansion logic
static/           Third-party JS libraries
*.html            Generated essay pages (committed to repo)
index.html        Entry point — loads OHMAN essay by default
view.html         Generic viewer template
essay-page-generator.py  Generates *.html from content/*.md
styles.css        All site styling
```

## Essay naming convention

Essays are named as all-caps acronyms of their full title (e.g. `OHMAN` = "On Home, Memory, ADEAEN and Narratives"). The HTML, content MD, and preview MD all share the same acronym stem.

## Adding a new essay

1. Write `content/ACRONYM.md` (full essay)
2. Write `previews/ACRONYM.md` (excerpt — ~usually last 500 words, prefixed `[...]`, with links to expand full or open in new tab)
3. Run `python essay-page-generator.py` — generates `ACRONYM.html` and updates nav links in all pages
4. Commit everything including the generated HTML

## Interactive expand links

In markdown, links that trigger inline expansion use specific CSS classes:

```html
<!-- Expand preview inline -->
<a href="previews/ACRONYM.md" class="expand-essay">link text</a>

<!-- Expand full essay inline -->
<a href="content/ACRONYM.md" class="expand-full">link text</a>
```

`expand.js` uses event delegation to intercept these clicks, fetch the markdown, parse it with `marked`, and render it below the link. Clicking again toggles collapse.

## Special cases

- **OHMAN** is the landing essay — its nav link points to `index.html`, not `OHMAN.html`
- **OHMAN** has alternate endings in `content/alt_endings/` — `index.html` randomly selects one on load
- `index.html` loads `content/OHMAN.md` dynamically via fetch; other essay pages use the same pattern via the generated HTML template
