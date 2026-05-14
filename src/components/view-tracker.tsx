"use client";

import { useEffect } from "react";

type Resource = "project" | "startup" | "skill" | "page";

export function ViewTracker(props: {
  path: string;
  resourceType: Resource;
  resourceSlug: string;
}) {
  useEffect(() => {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props),
    });
  }, [props.path, props.resourceSlug, props.resourceType]);
  return null;
}
