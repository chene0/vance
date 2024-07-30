import { asc, and, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './index';
import { InsertUser, SelectUser, users } from './schema';
import { InsertFile, files } from './schema';

// INSERT
export async function createUser(data: InsertUser) {
  await db.insert(users).values(data);
}

export async function createSet(data: InsertFile){
  await db.insert(files).values(data);
}

// SELECT
export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    pw: string | null;
    image: string | null;
    content: any;
    misc: any;
  }>
> {
  return db.select().from(users).where(eq(users.id, id));
}

// UPDATE

export async function updateUserById(id: SelectUser['id'], data: Partial<SelectUser>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

// DELETE

export async function deleteSetById(id: string){
  await db.delete(files).where(eq(files.id, id));
}