# ASRA marketing mirror (agent knowledge graph)

Synced from [asra/private/marketing](https://github.com/ilakkmanoharan/asra/tree/main/private/marketing) for the portfolio agent knowledge graph (`content/agent/claims.json`).

Refresh after editing ASRA marketing:

```bash
rsync -a --delete ../asra/private/marketing/ content/marketing/asra/
cd /path/to/ilakk-manoharan && npm run content:sync
```

Or set `ASRA_MARKETING_DIR` to the ASRA repo path when running `npm run content:sync`.
