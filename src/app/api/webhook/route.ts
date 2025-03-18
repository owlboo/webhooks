import { NextRequest, NextResponse } from "next/server";
import { createClient } from '../../../lib/superbase/client';
import { Folder } from '@/lib/superbase/supabase.types';


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


    .eq('folder_id', folder_id.toString())
    .order("created_at", {
      ascending: false
    })
    ;

  return NextResponse.json({
    webhooks: response.data,
    url: `${requestUrl.origin}/api/webhook/${folder_id}`
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