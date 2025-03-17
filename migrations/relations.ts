import { relations } from "drizzle-orm/relations";
import { folder, incomingWebhooks } from "./schema";

export const incomingWebhooksRelations = relations(incomingWebhooks, ({one}) => ({
	folder: one(folder, {
		fields: [incomingWebhooks.folderId],
		references: [folder.id]
	}),
}));

export const folderRelations = relations(folder, ({many}) => ({
	incomingWebhooks: many(incomingWebhooks),
}));