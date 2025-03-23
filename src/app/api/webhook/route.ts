import { NextRequest, NextResponse } from "next/server";
import { createClient } from '../../../lib/superbase/client';
import { Folder } from '@/lib/superbase/supabase.types';


export async function GET(req: NextRequest) {

  const requestUrl = new URL(req.url);

  const folder_id = requestUrl.searchParams.get('folder_id');

  if (!folder_id) {
    return NextResponse.json([]);
  }

  const isOnlyUnread = requestUrl.searchParams.get('isOnlyUnread') || false;
  const pageSize = requestUrl.searchParams.get('pageSize') || 10 as any;
  const page = requestUrl.searchParams.get('page') || 1 as any;

  const supabase = createClient();

  const supabaseQuery = supabase.from('webhook').select('*').eq('folder_id', folder_id.toString());
  supabaseQuery.range((page - 1) * pageSize, (page) * pageSize - 1);
  supabaseQuery.order("created_at", {
    ascending: false
  });
  if (isOnlyUnread) {
    supabaseQuery.eq('is_read', false);
  }

  const response = await supabaseQuery
    ;


  const countQuery = supabase.from('webhook').select('*', { count: 'exact', head: true }).eq('folder_id', folder_id.toString());
  if (isOnlyUnread) {
    countQuery.eq('is_read', false);
  }

  const { count } = await countQuery
  console.log(count);

  return NextResponse.json({
    webhooks: response.data,
    url: `${requestUrl.origin}/api/webhook/${folder_id}`,
    total: count
  });


}

export async function POST(req: NextRequest) {

  const supabase = createClient();

  const folder: Folder = {
    created_at: new Date().toISOString()
  }

  const { data: webhook } = await supabase.from("folder").insert(folder).select().single();

  const { origin } = new URL(req.url);

  return NextResponse.json({
    id: webhook.id,
    url: `${origin}/api/webhook/${webhook.id}`
  });
}