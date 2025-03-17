import { pgTable, foreignKey, uuid, json, varchar, timestamp, boolean } from "drizzle-orm/pg-core"

export const webhook = pgTable("webhook", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  headers: json(),
  url: varchar(),
  method: varchar(),
  query: varchar(),
  body: json(),
  client_ip: varchar("client_ip"),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  folder_id: uuid("folder_id"),
  tag: varchar(),
  is_read: boolean("is_read").default(false),
}, (table) => [
  foreignKey({
    columns: [table.folder_id],
    foreignColumns: [folder.id],
    name: "incoming_webhooks_folder_id_fkey"
  }),
]);

export const folder = pgTable("folder", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
