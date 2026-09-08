import { NextResponse, type NextRequest } from "next/server";

import { searchPosts } from "@/lib/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";
  const tag = searchParams.get("tag") ?? undefined;
  if (!query.trim()) return NextResponse.json([]);
  const results = await searchPosts(query, tag || undefined);
  return NextResponse.json(results);
}
