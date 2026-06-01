import { Fragment, type ReactNode } from "react";

const LINK_TOKEN =
  /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s),.;]+)/g;

function externalLinkClassName() {
  return "text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary";
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_TOKEN.lastIndex = 0;
  while ((match = LINK_TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const markdownHref = match[2];
    const bareHref = match[3];
    const href = markdownHref ?? bareHref;
    const children = label ?? bareHref;

    nodes.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className={externalLinkClassName()}
      >
        {children}
      </a>,
    );

    lastIndex = match.index + match[0].length;
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
