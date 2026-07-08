# Layer architecture — interactive webpage

Standalone HTML site with overview diagram and per-layer Q&amp;A.

## Open locally

**Overview (start here):**

```text
private/architecture-discussion/layers/web/index.html
```

Double-click `index.html` in Finder, or from repo root:

```bash
open private/architecture-discussion/layers/web/index.html
```

## Serve on a port (shareable link on your machine)

From the `web/` folder:

```bash
cd private/architecture-discussion/layers/web
python3 -m http.server 8765
```

Then open: **http://localhost:8765/**

On VPN, teammates can use `http://<your-ip>:8765/` if firewall allows.

## Color legend

- **Green** — shipped in voxtune (`main`, Jul 6 commit)
- **Purple** — D-01 v2 target (not yet committed)

## Files

```text
web/
├── index.html          # Overview diagram + layer links
├── layer-0.html … layer-5.html
├── css/styles.css
└── js/accordion.js     # Click question → show answer
```

Source markdown: `../layer-*.md`
