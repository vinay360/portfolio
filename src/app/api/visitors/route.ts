import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Visitor counter for the footer. Backed by Umami's stats API when
 * UMAMI_API_URL / UMAMI_WEBSITE_ID / UMAMI_API_TOKEN are configured;
 * otherwise reports failure and the footer hides the counter.
 */
export async function GET() {
  const apiUrl = process.env.UMAMI_API_URL;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const token = process.env.UMAMI_API_TOKEN;

  if (!apiUrl || !websiteId || !token) {
    return NextResponse.json({ success: false, error: "Analytics not configured" }, { status: 503 });
  }

  try {
    const endAt = Date.now();
    const startAt = 0;
    const res = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error(`Umami responded with ${res.status}`);
    const data = await res.json();
    const visitors = data?.visitors?.value ?? data?.visitors ?? 0;
    const pageviews = data?.pageviews?.value ?? data?.pageviews ?? 0;
    return NextResponse.json({ success: true, visitors, pageviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
