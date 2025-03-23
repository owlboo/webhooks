
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params // 'a', 'b', or 'c'


  const supabase = createClient();


  const { error } = await supabase.from("webhook").update({ is_read: true }).eq("tag", tag.toString());

  console.log(error);
  if (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json({});
}

