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

## Serve on a port

```bash
cd private/architecture-discussion/layers/web
python3 -m http.server 8765
```

Then open: **http://localhost:8765/**

## Color legend (v2 site)

- **All green** — v2 shipped in voxtune (Jul 10): SM edge planner, full-prefix traversal, entity pool, full LLM dialogue (Qwen), coverage report
- Historical **v1** page (green + purple) lives at portfolio `/voxlayer/` — Jul 6 baseline vs early v2 plan

## Live URLs

- v1 (historical): https://ilakk-manoharan.vercel.app/voxlayer/index.html
- v2 (current): https://ilakk-manoharan.vercel.app/voxlayer-v2/index.html

## Deploy

Copy this folder to `ilakk-manoharan/public/voxlayer-v2/` and push `main` (Vercel auto-deploys).

## Files

```text
web/
├── index.html
├── layer-0.html … layer-5.html
├── css/styles.css
└── js/accordion.js
```

*July 10, 2026*
