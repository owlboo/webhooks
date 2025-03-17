import { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { folder, incomingWebhooks } from '../../../migrations/schema'



export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];


export type Folder = {
  id?: string,
  created_at: string
}

export type Webhook = {
  id?: string,
  headers: Json,
  url: string,
  method: string,
  query: string,
  body?: Json,
  client_ip: string | undefined,
  created_at: string | undefined,
  folder_id: string,
  tag: string,
  is_read: boolean,
}