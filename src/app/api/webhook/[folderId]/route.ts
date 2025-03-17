import { createClient } from "@/lib/superbase/client";
import { Webhook } from "@/lib/superbase/supabase.types";
import { generateRandomString } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {

  const { folderId } = await params // 'a', 'b', or 'c'
  let body = {}; // Read the request body

  if (req.body) {
    body = await req.json()
  }
  console.log(body);

  const supbase = createClient();

  let response = await supbase.from("folder").select("*").eq("id", folderId);

  const { error } = response;
  if (error) {
    return NextResponse.json({}, { status: 404 });
  }

  const { searchParams } = new URL(req.url);

  console.log(req);

  let headers = Object.fromEntries(req.headers);
  const webhook: Webhook = {
    is_read: false,
    created_at: new Date().toISOString(),
    body: body,
    headers: headers,
    method: req.method,
    folder_id: folderId.toString(),
    client_ip: req.headers.get("x-forwarded-for")?.toString(),
    query: searchParams.toString() || "/",
    tag: generateRandomString(8),
    url: req.url,
  };

  const { data, error: insertError } = await supbase.from("webhook").insert(webhook).select();

  console.log(insertError);

  return NextResponse.json(data);
}
