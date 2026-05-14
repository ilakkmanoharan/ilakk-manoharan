export function getRequestIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function isHoneypotTripped(body: Record<string, unknown>) {
  const v = body.companyWebsite ?? body.website ?? body.url;
  return typeof v === "string" && v.trim().length > 0;
}
