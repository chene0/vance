import { asc, and, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './index';
import { InsertUser, SelectUser, users } from './schema';

// INSERT
export async function createUser(data: InsertUser) {
    await db.insert(users).values(data);
}

// SELECT
export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    pw: string;
    image: string | null;
    content: any;
    misc: any;
  }>
> {
  return db.select().from(users).where(eq(users.id, id));
}

export async function getUserByName(name: SelectUser['name']): Promise<
  Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    pw: string;
    image: string | null;
    content: any;
    misc: any;
  }>
> {
  return db.select().from(users).where(eq(users.name, name));
}
export async function getUserByCredentials(
  email: SelectUser['email'],
  pw: SelectUser['pw']
): Promise<
  Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    pw: string;
    image: string | null;
    content: any;
    misc: any;
  }>
> {
  return db
    .select()
    .from(users)
    .where(and(
      eq(users.email, email),
      eq(users.pw, pw)
    ))
}

// UPDATE


// DELETE