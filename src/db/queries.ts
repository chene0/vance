import { asc, and, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './index';
import { InsertUser, SelectQuestion, SelectUser, users } from './schema';
import { InsertFile, files } from './schema';
import { InsertQuestion, questions } from './schema';

// INSERT
export async function createUser(data: InsertUser) {
  await db.insert(users).values(data);
}

export async function createSet(data: InsertFile){
  await db.insert(files).values(data);
}

export async function createQuestion(data: InsertQuestion){
  await db.insert(questions).values(data);
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

export async function getQuestionById(id: string): Promise<
  Array<{
    id: string;
    fileId: string;
    name: string;
    isAutogenerated: boolean;
    color: string;
    pageNumber: number;
    leftBound: number;
    topBound: number;
    priorityRating: number;
  }>
> {
  return db.select().from(questions).where(eq(questions.id, id));
}

export async function getQuestionsByPageNumberAndFileId(pageNumber: number, fileId: string): Promise<
  Array<{
    id: string;
    fileId: string;
    name: string;
    color: string;
    pageNumber: number;
    leftBound: number;
    topBound: number;
    priorityRating: number;
  }>
> {
  return db.select().from(questions).where(and(eq(questions.pageNumber, pageNumber), eq(questions.fileId, fileId)));
}

export async function getAutogeneratedQuestionsByFileId(fileId: string): Promise<
  Array<{
    id: string;
    fileId: string;
    name: string;
    isAutogenerated: boolean;
    color: string;
    pageNumber: number;
    leftBound: number;
    topBound: number;
    priorityRating: number;
  }>
> {
  return db.select().from(questions).where(and(eq(questions.isAutogenerated, true), eq(questions.fileId, fileId)));
}

// UPDATE

export async function updateUserById(id: SelectUser['id'], data: Partial<SelectUser>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function updateQuestionById(id: string, data: Partial<SelectQuestion>) {
  await db.update(questions).set(data).where(eq(questions.id, id));
}

// DELETE

export async function deleteSetById(id: string){
  await db.delete(files).where(eq(files.id, id));
}

export async function deleteAutogeneratedQuestionsByFileId(fileId: string){
  await db.delete(questions).where(and(eq(questions.isAutogenerated, true), eq(questions.fileId, fileId)));
}