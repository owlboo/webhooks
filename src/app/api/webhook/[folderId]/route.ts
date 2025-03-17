import { createClient } from "@/lib/superbase/client";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";
import { Folder, IncommingWebhooks, Webhook } from '@/lib/superbase/supabase.types';
import { generateRandomString } from '@/lib/utils'
import { uuid } from "drizzle-orm/pg-core";
const API_URL = env.WEBHOOK_API_DOMAIN;

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

  var { data, error } = await supbase.from("folder").select("*").eq("id", folderId);

  if (error) {
    return NextResponse.json({}, { status: 404 });
  }

  const { searchParams } = new URL(req.url);

  console.log(req);

  var headers = Object.fromEntries(req.headers);
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

  var { data, error } = await supbase.from("webhook").insert(webhook).select();

  console.log(error);

  return NextResponse.json(data);
}
