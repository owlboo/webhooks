
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

const API_URL = env.WEBHOOK_API_DOMAIN;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params // 'a', 'b', or 'c'

  const requestUrl = `${API_URL}/api/webhook/get/${tag}`;

  const response = await fetch(requestUrl, {});

  var data = await response.json();

  return NextResponse.json(data.data);
}
