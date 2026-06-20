/** Questions asking what a program/project is — not skill or experience queries. */
export function isProgramDefinitionQuestion(question: string): boolean {
  const q = question.toLowerCase();
  if (
    !/\b(what is|what are|what's|explain|tell me about|describe|overview of|define)\b/.test(
      q,
    )
  ) {
    return false;
  }
  return /\b(nfm|nature foundation models?|asra|atlas-gs|decision biology|orbit wars|arc-genome|neurogolf|scilayer|researchgraph)\b/.test(
    q,
  );
}

export function isNfmQuestion(question: string): boolean {
  return /\b(nfm|nature foundation models?)\b/i.test(question);
}
