import { incomingWebhooks } from './../../../../migrations/schema';

import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

import { createClient } from '../../../lib/superbase/client';
import { uuid } from 'drizzle-orm/pg-core';
import { Folder } from '@/lib/superbase/supabase.types';
import { url } from 'inspector';


const API_URL = env.WEBHOOK_API_DOMAIN;
export async function GET(req: NextRequest) {

  const requestUrl = new URL(req.url);

  const folder_id = requestUrl.searchParams.get('folder_id');

  if (!folder_id) {
    return NextResponse.json([]);
  }

  const supabase = createClient();

  const response = await supabase
    .from('webhook')

    .select('*')

    .eq('folder_id', folder_id.toString());

  return NextResponse.json({
    webhooks: response.data,
    url: `${requestUrl.origin}/api/webhook/${folder_id}`
  });


}

export async function POST(req: NextRequest) {

  const supabase = createClient();

  let folder: Folder = {
    created_at: new Date().toISOString()
  }

  const { data: webhook, error } = await supabase.from("folder").insert(folder).select().single();

  console.log(error);
  console.log(webhook);

  let { origin } = new URL(req.url);

  return NextResponse.json({
    id: webhook.id,
    url: `${origin}/api/webhook/${webhook.id}`
  });
}