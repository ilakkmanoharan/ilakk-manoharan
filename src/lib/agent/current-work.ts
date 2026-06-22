import fs from "node:fs";
import path from "node:path";
import { markdownToHtml, markdownToPlainText } from "@/lib/agent/simple-markdown";

const CURRENT_WORK_PATH = path.join(process.cwd(), "content/agent/current-work.md");
const CURRENT_WORK_SHORT_PATH = path.join(
  process.cwd(),
  "content/agent/current-work-short.md",
);

export { CURRENT_PROJECT_PROMPT, isCurrentProjectQuestion } from "@/lib/agent/current-project";

export function loadCurrentWorkMarkdown(): string {
  return fs.readFileSync(CURRENT_WORK_PATH, "utf8");
}

export function loadCurrentWorkShortMarkdown(): string {
  return fs.readFileSync(CURRENT_WORK_SHORT_PATH, "utf8");
}

export function getCurrentWorkAnswer() {
  const markdown = loadCurrentWorkMarkdown();
  const spokenMarkdown = loadCurrentWorkShortMarkdown();
  return {
    markdown,
    html: markdownToHtml(markdown),
    plain: markdownToPlainText(markdown),
    spoken: spokenMarkdown.trim(),
    sources: [
      "https://sci-layer.vercel.app/authors/0009-0008-8073-5416",
      "https://ilakk-manoharan.vercel.app",
    ],
  };
}
