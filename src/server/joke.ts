import { db } from "#/db";
import { joke, user, vote } from "#/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq, and } from 'drizzle-orm';

export const getJokes = createServerFn().handler(async()=>{
    /* SQL Query:
    SELECT j.id, j.content as joke_content, u.name as cracker, u.id as cracker_id, v.user_id as voter_id, v.voted FROM joke as j 
  LEFT JOIN "user" as u ON j.user_id = u.id 
  LEFT JOIN "vote" as v on j.id=v.joke_id
  order by j.created_at;
  db.select({
  jokeId : joke.id,
  jokeContent: joke.content,
  cracker: user.name,
  crackerId: user.id,
  voterId: vote.user_id,
  voted: vote.voted,
  }).from(joke).leftJoin(user, eq(joke.userId, user.id))
  .leftJoin(vote, eq(joke.id, vote.jokeId));
    */
    const jokes = await db.select().from(joke).leftJoin(user, eq(joke.userId, user.id));
    /*const jokes = await db.select({
  jokeId : joke.id,
  jokeContent: joke.content,
  cracker: user.name,
  crackerId: user.id,
  voterId: vote.userId,
  votedUD: vote.voted,
  }).from(joke).leftJoin(user, eq(joke.userId, user.id))
  .leftJoin(vote, eq(joke.id, vote.jokeId));*/
    return jokes;
})

export const getVotes = createServerFn().handler(async()=>{
  const votes = await db.select().from(vote);
  return votes;
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

export const deleteJoke = createServerFn({method:"POST"}).inputValidator((id: number)=>id)
.handler(async({data: id}) => {
    await db.delete(joke).where(eq(joke.id, id));
    return { success: true }
})

export interface JokeData {
  jokeId: number;
  voteValue: string;
  userId: string;
}

export const deleteVote = createServerFn({method:"POST"}).inputValidator((data: JokeData)=>data)
.handler(async({data}) => {
  await db.delete(vote).where(and(eq(vote.jokeId, data.jokeId),eq(vote.userId, data.userId)));
  return { success: true }
})

export const updateVote = createServerFn({method:"POST"}).inputValidator((data: JokeData)=>data)
.handler(async({data}) => {
  try{
    const res = await db.select().from(vote)
    .where(and(eq(vote.jokeId, data.jokeId),eq(vote.userId, data.userId)));
    if(res.length==0){
      await db.insert(vote)
      .values({
        jokeId:data.jokeId, 
        userId:data.userId, 
        voted:data.voteValue
      });
    }else{
      await db.update(vote)
      .set({voted: data.voteValue})
      .where(
        and(
          eq(vote.jokeId, data.jokeId),
          eq(vote.userId, data.userId)
        )
      );
    }
    return{success:true};
  }catch(err){
    return{success:false, error:"fail to update vote"};
  }
})
type NewJoke = typeof joke.$inferInsert;