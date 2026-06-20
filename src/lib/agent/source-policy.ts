const BLOCKED_SOURCE_PATTERNS = [
  /^asra-marketing:\/\//i,
  /\/emails\//i,
  /^emails\//i,
  /\/email\d/i,
  /^private\//i,
  /^file:\/\//i,
];

/** Sources safe to show in public agent answers (website + GitHub + linked public apps). */
export function isPublicAgentSource(source: string): boolean {
  const s = source.trim();
  if (!s) return false;
  if (BLOCKED_SOURCE_PATTERNS.some((p) => p.test(s))) return false;
  return /^https?:\/\//i.test(s);
}

export function filterPublicSources(sources: string[]): string[] {
  return [...new Set(sources.filter(isPublicAgentSource))];
}

export function claimHasPublicSource(claim: { sources: string[] }): boolean {
  if (claim.sources.length === 0) return true;
  return claim.sources.some(isPublicAgentSource);
}

/** Exclude private marketing email claims and claims with no public citations. */
export function claimIsEligibleForRetrieval(claim: {
  id: string;
  sources: string[];
}): boolean {
  if (/claim-auto-asra-marketing-emails-/i.test(claim.id)) return false;
  if (
    claim.sources.some(
      (s) =>
        /asra-marketing:\/\/emails\//i.test(s) || /\/emails\/email/i.test(s),
    )
  ) {
    return false;
  }
  return claimHasPublicSource(claim);
}
