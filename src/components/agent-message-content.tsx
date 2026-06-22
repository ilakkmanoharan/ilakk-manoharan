"use client";

type AgentMessageContentProps = {
  content: string;
  html?: string;
};

export function AgentMessageContent({ content, html }: AgentMessageContentProps) {
  if (html) {
    return (
      <div
        className="prose-agent text-sm [&_a]:text-primary [&_a]:hover:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <p className="whitespace-pre-wrap text-sm">{content}</p>;
}
