import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NeurogolfSubmissionDetail } from "@/lib/neurogolf-lora-research";

function outcomeBadge(outcome: string) {
  switch (outcome) {
    case "score_up":
      return <Badge className="bg-emerald-600 hover:bg-emerald-600">score up</Badge>;
    case "score_flat":
      return <Badge variant="secondary">flat</Badge>;
    case "score_down":
      return <Badge variant="destructive">down</Badge>;
    case "pending_grade":
      return <Badge variant="outline">pending</Badge>;
    case "not_submitted":
      return <Badge variant="outline">not submitted</Badge>;
    default:
      return <Badge variant="outline">{outcome}</Badge>;
  }
}

function fmtNum(n: number | null | undefined, digits = 2) {
  if (n == null) return "—";
  return n.toFixed(digits);
}

type Props = {
  submissions: NeurogolfSubmissionDetail[];
};

export function NeurogolfSubmissionsTable({ submissions }: Props) {
  if (!submissions.length) {
    return (
      <p className="text-sm text-muted-foreground">No submission records yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="p-3">Submission</th>
            <th className="p-3">Milestone</th>
            <th className="p-3">Kaggle</th>
            <th className="p-3">pass_all</th>
            <th className="p-3">Est</th>
            <th className="p-3">Δ</th>
            <th className="p-3">Outcome</th>
            <th className="p-3">ONNX</th>
            <th className="p-3">Research</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => {
            const docEntries = Object.entries(s.docs).filter(([k]) => k !== "folder");
            return (
              <tr key={s.label} className="border-b align-top last:border-0">
                <td className="p-3">
                  <div className="font-medium">{s.label}</div>
                  {s.message ? (
                    <div className="mt-1 max-w-xs text-xs text-muted-foreground">
                      {s.message}
                    </div>
                  ) : null}
                  {s.new_tasks?.length ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      +tasks {s.new_tasks.join(", ")}
                    </div>
                  ) : null}
                </td>
                <td className="p-3">
                  <div>{s.milestone ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    phase {s.phase ?? "—"}
                  </div>
                </td>
                <td className="p-3 font-medium">
                  {s.kaggle_actual != null
                    ? fmtNum(s.kaggle_actual)
                    : s.submitted
                      ? "pending"
                      : "—"}
                </td>
                <td className="p-3">
                  {s.pass_all ?? "—"}
                  {s.kaggle_eligible != null &&
                  s.pass_all != null &&
                  s.kaggle_eligible !== s.pass_all ? (
                    <div className="text-xs text-amber-700 dark:text-amber-400">
                      {s.kaggle_eligible} Kaggle-eligible
                    </div>
                  ) : null}
                  {s.oversized_pass_all ? (
                    <div className="text-xs text-amber-700 dark:text-amber-400">
                      {s.oversized_pass_all} oversized
                    </div>
                  ) : null}
                </td>
                <td className="p-3">{s.kaggle_est != null ? Math.round(s.kaggle_est) : "—"}</td>
                <td className="p-3">
                  {s.kaggle_delta != null ? (
                    <span
                      className={
                        s.kaggle_delta > 0
                          ? "text-emerald-700 dark:text-emerald-400"
                          : s.kaggle_delta < 0
                            ? "text-red-600"
                            : ""
                      }
                    >
                      {s.kaggle_delta > 0 ? "+" : ""}
                      {s.kaggle_delta}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">{outcomeBadge(s.outcome)}</td>
                <td className="p-3">{s.onnx_count ?? "—"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {s.docs.folder ? (
                      <a
                        href={s.docs.folder}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-primary hover:underline"
                      >
                        folder <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                    {docEntries.map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
