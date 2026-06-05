import { Fragment, type ReactNode } from "react";

/** Markdown links: [label](https://...) */
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

/** Bare URLs — allow dots and path chars; trim trailing punctuation after match. */
const BARE_URL = /https?:\/\/[^\s<>"\]]+/g;

const TRAILING_URL_PUNCTUATION = /[.,;:!?)·]+$/u;

function externalLinkClassName() {
  return "text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary";
}

function trimTrailingUrlPunctuation(url: string): string {
  return url.replace(TRAILING_URL_PUNCTUATION, "");
}

type TextMatch = {
  index: number;
  length: number;
  href: string;
  label: string;
};

function findLinkMatches(text: string): TextMatch[] {
  const matches: TextMatch[] = [];

  MARKDOWN_LINK.lastIndex = 0;
  let markdownMatch: RegExpExecArray | null;
  while ((markdownMatch = MARKDOWN_LINK.exec(text)) !== null) {
    matches.push({
      index: markdownMatch.index,
      length: markdownMatch[0].length,
      href: markdownMatch[2],
      label: markdownMatch[1],
    });
  }

  BARE_URL.lastIndex = 0;
  let bareMatch: RegExpExecArray | null;
  while ((bareMatch = BARE_URL.exec(text)) !== null) {
    const raw = bareMatch[0];
    const href = trimTrailingUrlPunctuation(raw);
    if (!href) continue;

    const insideMarkdown = matches.some(
      (m) =>
        bareMatch!.index >= m.index &&
        bareMatch!.index < m.index + m.length,
    );
    if (insideMarkdown) continue;

    matches.push({
      index: bareMatch.index,
      length: raw.length,
      href,
      label: href,
    });
  }

  matches.sort((a, b) => a.index - b.index);

  const merged: TextMatch[] = [];
  for (const match of matches) {
    const prev = merged[merged.length - 1];
    if (prev && match.index < prev.index + prev.length) continue;
    merged.push(match);
  }

  return merged;
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const linkMatches = findLinkMatches(text);
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of linkMatches) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <a
        key={`${match.href}-${match.index}`}
        href={match.href}
        target="_blank"
        rel="noreferrer"
        className={externalLinkClassName()}
      >
        {match.label}
      </a>,
    );

    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {nodes.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </span>
  );
}
