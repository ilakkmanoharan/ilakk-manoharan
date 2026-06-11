const ILAK_NAME_PARTS = ["ilakkuvaselvi", "ilak manoharan", "ilakk manoharan"];
const ILAK_ORCID = "0009-0008-8073-5416";

type AuthorMeta = {
  name?: string;
  orcid?: string;
};

export function isIlakSciLayerAuthor(authors: AuthorMeta[] | undefined): boolean {
  if (!authors?.length) return true;
  return authors.some((a) => {
    const name = (a.name ?? "").toLowerCase();
    const orcid = (a.orcid ?? "").replace(/-/g, "");
    if (orcid.includes(ILAK_ORCID.replace(/-/g, ""))) return true;
    return ILAK_NAME_PARTS.some((part) => name.includes(part));
  });
}
