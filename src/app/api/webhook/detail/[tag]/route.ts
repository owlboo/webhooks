
import { createClient } from "@/lib/superbase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params // 'a', 'b', or 'c'


  const supabase = createClient();

  const { data: webhook, error } = await supabase.from("webhook").select("*").eq("tag", tag.toString()).single();

  if (error) {
    return NextResponse.json({});
  }

  return NextResponse.json(webhook);
}
