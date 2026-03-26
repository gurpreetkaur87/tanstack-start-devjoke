import { db } from "#/db";
import { joke, user } from "#/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from 'drizzle-orm';
import type { integer } from "drizzle-orm/pg-core";

export const getJokes = createServerFn().handler(async()=>{
    const jokes = await db.select().from(joke).leftJoin(user, eq(joke.userId, user.id));
    return jokes;
})

export const createJoke = createServerFn({ method: "POST" })
.inputValidator((data: NewJoke)=>data)
  .handler(async ({ data }) => {
    const [inserted] = await db
      .insert(joke)
      .values({ content:data.content, userId:data.userId })
      .returning();
    return inserted;
  });

export const deleteJoke = createServerFn({method:"POST"}).inputValidator((data: jokeIdtype)=>data)
.handler(async({data}) => {
    const deleteJoke = await db.delete(joke).where(eq(joke.id, data.id));
    return deleteJoke;
})
type jokeIdtype = typeof integer;
type NewJoke = typeof joke.$inferInsert;