import { pgTable, foreignKey, uuid, json, varchar, timestamp, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const incomingWebhooks = pgTable("incoming_webhooks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	headers: json(),
	url: varchar(),
	method: varchar(),
	query: varchar(),
	body: json(),
	clientIp: varchar("client_ip"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	folderId: uuid("folder_id"),
	tag: varchar(),
	isRead: boolean("is_read").default(false),
}, (table) => [
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folder.id],
			name: "incoming_webhooks_folder_id_fkey"
		}),
]);

export const folder = pgTable("folder", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
