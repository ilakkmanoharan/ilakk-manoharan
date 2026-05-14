import { Suspense } from "react";
import AdminLoginClient from "./login-client";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm">Loading…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
