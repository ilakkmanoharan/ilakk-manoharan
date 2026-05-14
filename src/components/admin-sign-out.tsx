"use client";

import { Button } from "@/components/ui/button";

export function AdminSignOut() {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </Button>
  );
}
