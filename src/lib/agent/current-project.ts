export const CURRENT_PROJECT_PROMPT = "tell me about Ilak's current project";

export function isCurrentProjectQuestion(question: string): boolean {
  const q = question.toLowerCase().replace(/[''`]/g, "'");
  return (
    /tell me about ilak'?s? current project/.test(q) ||
    /what is ilak'?s? current project/.test(q) ||
    (/ilak'?s? current project/.test(q) &&
      /\b(tell|about|what|describe|explain)\b/.test(q))
  );
}
