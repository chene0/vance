import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './index';
import { InsertUser, SelectUser, usersTable } from './schema';

// INSERT
export async function createUser(data: InsertUser) {
    await db.insert(usersTable).values(data);
}

// SELECT
export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: number;
    name: string;
    email: string;
    pw: string;
    content: any;
    misc: any;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

// UPDATE


// DELETE