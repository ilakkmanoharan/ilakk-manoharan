/** Fallbacks when `appStoreUrl` is missing in the DB (e.g. before `npm run db:seed`). */
export const DEFAULT_APP_STORE_BY_PROJECT_SLUG: Readonly<Record<string, string>> = {
  "tag-scribe": "https://apps.apple.com/us/app/tagscribe/id6760214615",
};
