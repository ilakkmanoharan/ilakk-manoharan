# Social posts

Drop a **markdown** or **JSON card** here and push to `main`. GitHub Actions runs the publish agent:

1. Posts to [X](https://x.com/ilakkManoharan)
2. Posts to [LinkedIn](https://linkedin.com/in/ilakkmanoharan)
3. Appends the post to the portfolio **Social** tab with UTC date/time

Published records live in `content/social/posts.json` (do not edit by hand unless fixing metadata).

## Markdown post

```markdown
---
title: ASRA-LoRA concept paper
tags: [ScientificAI, LoRA, ARC]
link: https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning
---

New concept paper: ASRA-LoRA — teaching models *how* to reason from transition traces, not just answers.

HypothesisLoRA · ExplorationLoRA · FailureLoRA · TraceLoRA on Qwen2.5.

https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning

#ScientificAI #LoRA #ARC
```

Optional frontmatter overrides:

- `x_body` — text for X only (defaults to body)
- `linkedin_body` — text for LinkedIn only (defaults to body)
- `skip_x: true` / `skip_linkedin: true` — skip a channel

If your file uses the marketing format with `## Post (recommended — single post)`, that section is extracted automatically.

## JSON card

```json
{
  "title": "ASRA-LoRA launch",
  "body": "Post text for all channels…",
  "tags": ["ScientificAI", "LoRA"],
  "link": "https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning"
}
```

## GitHub secrets (repository settings)

| Secret | Purpose |
|--------|---------|
| `X_API_KEY` | X API consumer key |
| `X_API_SECRET` | X API consumer secret |
| `X_ACCESS_TOKEN` | X user access token |
| `X_ACCESS_TOKEN_SECRET` | X user access token secret |
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn OAuth token with `w_member_social` |
| `LINKEDIN_AUTHOR_URN` | e.g. `urn:li:person:YOUR_ID` |

Optional: set workflow input `dry_run: true` to validate parsing without posting.

## Local dry run

```bash
SOCIAL_DRY_RUN=1 npx tsx scripts/social-publish/publish.ts --file social/example-post.md
```
