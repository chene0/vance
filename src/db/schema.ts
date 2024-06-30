import { sql } from "drizzle-orm";
import { integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
// import { json } from 'stream/consumers';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  pw: text('pw').notNull(),
  content: json('content'),
  misc: json('misc'),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;