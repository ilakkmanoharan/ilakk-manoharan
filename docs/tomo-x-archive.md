# TOMO X archive

The TOMO project links to `/projects/tomo/blog`. The blog reads the versioned
post index at `content/tomo-posts.json` and groups it by publication date in
America/Chicago. Pictures are checked in under `public/tomo`. The two initial
entries are labeled summaries based on the existing project page.

## Backfill

Request an X account export, extract it outside the repository, and run the
following from the repository root using Node 24:

```sh
node scripts/sync-tomo-x.mjs /absolute/path/to/extracted-x-archive
```

The importer reads `data/tweets*.js` and copies matched photos from
`data/tweets_media`. Review the archive and add any implicit TOMO posts missed
by the topic matcher before committing. The matcher includes explicit TOMO
terms, the graph paper title and DOI, and replies to matched posts. Check in
only the generated public post index and its images. The raw export may include
private data and belongs outside Git. Use an export from @ilakkManoharan and
review its matched posts for public visibility before pushing.

## Scheduled updates

Set the repository Actions secret `X_BEARER_TOKEN` with access to the X user
timeline. The workflow runs daily and can also be run manually. The first run
reads the available timeline. Subsequent runs fetch posts after the saved
cursor. X limits the timeline to the most recent 3,200 posts, so use the export
for a full backfill. X usage charges may apply.

If Vercel requires a recognized commit author, set `TOMO_COMMIT_EMAIL` to the
verified GitHub email of a Vercel project member. If the GitHub integration
does not deploy pushes made by the default Actions token, set the optional
`TOMO_GITHUB_TOKEN` Actions secret to a fine-grained token with repository
contents write access for that member. Verify the first deployment from an
automated archive commit.

## Public URL import and daily Codex sync

The eight requested posts were backfilled with their complete public text. The
archive contains 10 entries including the two original, explicitly labeled
summaries. Post dates use America/Chicago, so an evening post may appear under
the preceding date compared with X's UTC embed date.

Import explicitly selected public posts without an API key:

```sh
node scripts/import-tomo-x-urls.mjs https://x.com/ilakkManoharan/status/POST_ID
```

The importer validates the post ID, author, publication timestamp and text prefix
against X's public syndication endpoint. It uses api.fxtwitter.com for full long
post text, saves original photos from pbs.twimg.com, retains reference links,
and deduplicates by post ID. Public endpoints may become unavailable; failures
stop the import rather than silently storing truncated text. This importer does
not discover new posts by itself.

A Codex automation, “Sync TOMO posts to blog and GitHub”, checks daily at 9 a.m.
America/Chicago. It discovers public posts, imports new TOMO URLs, commits and
pushes the archive, and checks the production deployment. It runs locally and
requires Codex/the computer to be available, network access and GitHub access;
X browsing can require a signed-in session. It reports access/import failures.
This is scheduled polling, not instant synchronization.

The separate GitHub Actions workflow remains the unattended server-side option.
It still requires the `X_BEARER_TOKEN` repository secret. It now fails visibly
when the credential is absent rather than reporting a successful no-op. The
Codex automation does not require that secret when public post discovery works.
