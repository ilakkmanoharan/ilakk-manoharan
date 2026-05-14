export type GrantProposal = {
  agency: string;
  title: string;
  bullets: string[];
  repoUrl: string;
};

/**
 * Parse `content/projects/grant-proposals/proposals.md`:
 * section headers (ISS National Lab:, National Science Foundation:, NASA:),
 * proposal blocks (title + optional ● bullets), then a GitHub URL line.
 */
export function parseGrantProposals(markdown: string): GrantProposal[] {
  const lines = markdown.split(/\r?\n/);
  const proposals: GrantProposal[] = [];
  let agency = "Federal";
  const buffer: string[] = [];

  const isGithubUrl = (s: string) => /^https:\/\/github\.com\//i.test(s.trim());

  const flush = (url: string) => {
    const parts = buffer
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (parts.length === 0 || !isGithubUrl(url)) return;

    const bulletIdx = parts.findIndex((l) => l.startsWith("●"));
    let title: string;
    let bullets: string[];
    if (bulletIdx === -1) {
      title = parts.join(" ");
      bullets = [];
    } else {
      title = parts.slice(0, bulletIdx).join(" ");
      bullets = parts
        .slice(bulletIdx)
        .map((l) => l.replace(/^●\s*/, "").trim())
        .filter(Boolean);
    }
    if (title) {
      proposals.push({
        agency,
        title,
        bullets,
        repoUrl: url.trim(),
      });
    }
    buffer.length = 0;
  };

  for (const line of lines) {
    const t = line.trim();

    if (isGithubUrl(line)) {
      flush(line);
      continue;
    }

    if (t.endsWith(":") && !t.startsWith("●")) {
      if (/ISS National Lab/i.test(t)) agency = "ISS National Lab";
      else if (/National Science Foundation/i.test(t)) agency = "NSF";
      else if (/^NASA/i.test(t)) agency = "NASA";
      continue;
    }

    if (t === "") continue;

    buffer.push(line);
  }

  return proposals;
}

export function groupProposalsByAgency(
  proposals: GrantProposal[],
): { agency: string; items: GrantProposal[] }[] {
  const order: string[] = [];
  const map = new Map<string, GrantProposal[]>();

  for (const p of proposals) {
    if (!map.has(p.agency)) {
      order.push(p.agency);
      map.set(p.agency, []);
    }
    map.get(p.agency)!.push(p);
  }

  return order.map((agency) => ({
    agency,
    items: map.get(agency)!,
  }));
}
