import { authClient } from '#/lib/auth-client'
import { getJokes, deleteJoke, getVotes, deleteVote, updateVote } from '#/server/joke';
import type { JokeData } from '#/server/joke';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { BsArrowDownSquare, BsArrowUpSquare, BsArrowDownSquareFill, BsArrowUpSquareFill } from "react-icons/bs";


export const Route = createFileRoute('/')({ 
  component: App,
  loader: async() => {
    const jokes = await getJokes();
    const votes = await getVotes();
    return {jokes, votes};
  }
})

function App() {
  const navigate = useNavigate();
  type NumberKeyedObject = { [key: number]: string; };
  type NumberKeyedNumberValueObject = { [key: number]: number; };
  const { data:session } = authClient.useSession();
  //const jokes = Route.useLoaderData();
  const jv = Route.useLoaderData();
  const jokes = jv.jokes;
  const votes = jv.votes;
  const currentUsersJokesWithVotes : Array< NumberKeyedObject >  = [];
  const totalVotesOfEachJoke: NumberKeyedNumberValueObject[]  = [];
  jokes.map((eachJoke)=>{
    let totalvotes = 0;
    const myNumberKey = eachJoke.joke.id;
    const votesForCurrentJoke = votes.filter(eachVote => eachVote.jokeId === eachJoke.joke.id);
    
    votesForCurrentJoke.map((eachVoteForCurrentJoke)=>{            
      if(eachVoteForCurrentJoke.voted == 'up'){
          totalvotes = totalvotes + 1;
      }
      if(eachVoteForCurrentJoke.voted == 'down'){
          totalvotes = totalvotes - 1;
      }
      if(eachVoteForCurrentJoke.userId==session?.user.id){                
          currentUsersJokesWithVotes.push({ [myNumberKey]: eachVoteForCurrentJoke.voted });
      } 
    })

    totalVotesOfEachJoke.push({ [myNumberKey]: totalvotes });
    totalvotes = 0;

  });

  totalVotesOfEachJoke.sort((a, b) => {
    // Extract the first value from each object
    const valueA = Object.values(a)[0];
    const valueB = Object.values(b)[0];
    return valueB - valueA;
  });
  const topthreeJokeIds = totalVotesOfEachJoke.slice(0,3).map(obj => Number(Object.keys(obj)[0]));;
  
  console.log(topthreeJokeIds);
  console.log(currentUsersJokesWithVotes);
  console.log(totalVotesOfEachJoke);

  const handleDelete = async(jokeId : number) => {
    try {
      await deleteJoke({ data: jokeId });
      } catch (err) {
      alert(String(err));
      }
      navigate({to:"/"});
  }

  const handleVote = async(jokeId : number, voteValue: string) => {
    try {
      const data: JokeData = {
        jokeId: jokeId,
        voteValue: voteValue,
        userId: session?.user.id as string
      }
      if(voteValue=="removeVote"){
        await deleteVote({ data: data });
      }else{        
        await updateVote({data: data});
      }
      
    } catch (err) {
      alert(String(err));
    }
    navigate({to:"/"});
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        {/*<p className="island-kicker mb-3">TanStack Start Base Template</p>*/}
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          DevJokes Community
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          { !session ? 
            (<>
            Welcome to community of developer jokes. 
            Please <Link to="/signin">Login</Link> to laugh with developers.
            </>)
            :
            (<>  
              Welcome {session.user.name},<br/>
              Now you can install(Add) the jokes to developer community.              
            </>)
          }
        </p>
        { session && (
          <div className="flex flex-wrap gap-3">
          <Link to='/addjoke' className='rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]'>
            Add Joke
          </Link>
        </div>
        ) }        
      </section>
      
      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Joke Bin</p>
        { jokes.length==0 ? 
          <><span>No joke found</span></>
          : 
          <ul className="m-0 list-none space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
            Top Jokes
            {
              topthreeJokeIds.map((eachTopThreeJokeId)=>(

                jokes.map((eachJoke)=>(
                  eachJoke.joke.id==eachTopThreeJokeId?
                <>
                <li className="island-shell mt-8 rounded-2xl p-6" key={eachJoke.joke.id}>
                  {eachJoke.joke.content}<br/>cracked by:{eachJoke.user?.name}
                  {
                    session && (
                      <>
                        {
                          currentUsersJokesWithVotes.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] == "up"?
                          <><BsArrowUpSquareFill onClick={()=>handleVote(eachJoke.joke.id, "removeVote")}/>
                          <BsArrowDownSquare onClick={()=>handleVote(eachJoke.joke.id, "down")} /></>
                          :(currentUsersJokesWithVotes.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] == "down"? 
                          <><BsArrowUpSquare onClick={()=>handleVote(eachJoke.joke.id, "up")}/>
                          <BsArrowDownSquareFill onClick={()=>handleVote(eachJoke.joke.id, "removeVote")}/></> 
                          : 
                          <><BsArrowUpSquare onClick={()=>handleVote(eachJoke.joke.id, "up")}/>
                          <BsArrowDownSquare onClick={()=>handleVote(eachJoke.joke.id, "down")} /></>)
                        
                        }
                        <span>{
                          totalVotesOfEachJoke.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] ?? "0"
                        }</span>
                      </>
                    )
                  }
                  {
                  session && 
                    ( eachJoke.user?.id==session.user.id && (
                      <><br/>                  
                      <button
                      className="flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onClick={()=>handleDelete(eachJoke.joke.id)}>Delete</button>                  
                      </>
                      )                      
                    )
                  }
                </li>
                </> : <></>
                )) 
              ))
            }

            Other Jokes:
          { jokes.map((eachJoke)=>(
            topthreeJokeIds.indexOf(eachJoke.joke.id) == -1 ?
            <>
            <li className="island-shell mt-8 rounded-2xl p-6" key={eachJoke.joke.id}>
              {eachJoke.joke.content}<br/>cracked by:{eachJoke.user?.name}
              {
                session && (
                  <>
                    {
                      currentUsersJokesWithVotes.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] == "up"?
                      <><BsArrowUpSquareFill onClick={()=>handleVote(eachJoke.joke.id, "removeVote")}/>
                      <BsArrowDownSquare onClick={()=>handleVote(eachJoke.joke.id, "down")} /></>
                      :(currentUsersJokesWithVotes.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] == "down"? 
                      <><BsArrowUpSquare onClick={()=>handleVote(eachJoke.joke.id, "up")}/>
                      <BsArrowDownSquareFill onClick={()=>handleVote(eachJoke.joke.id, "removeVote")}/></> 
                      : 
                      <><BsArrowUpSquare onClick={()=>handleVote(eachJoke.joke.id, "up")}/>
                      <BsArrowDownSquare onClick={()=>handleVote(eachJoke.joke.id, "down")} /></>)
                    
                    }
                    <span>{
                      totalVotesOfEachJoke.find(obj => obj[eachJoke.joke.id] !== undefined)?.[eachJoke.joke.id] ?? "0"
                    }</span>
                  </>
                )
              }
              {
              session && 
                ( eachJoke.user?.id==session.user.id && (
                  <><br/>                  
                  <button
                  className="flex justify-center rounded-md bg-indigo-500 px-3 py-1 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={()=>handleDelete(eachJoke.joke.id)}>Delete</button>                  
                  </>
                  )                      
                )
              }
            </li>
            </>
            : <></>
            )) 
          }
        </ul>
        }
      </section>
    </main>
  )
}
