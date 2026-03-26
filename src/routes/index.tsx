import { authClient } from '#/lib/auth-client'
import { getJokes, deleteJoke } from '#/server/joke';
import { createFileRoute, Link } from '@tanstack/react-router'
import type { integer } from 'drizzle-orm/pg-core';

type jokeIdtype = typeof integer;
export const Route = createFileRoute('/')({ 
  component: App,
  loader: async() => {
    const jokes = await getJokes();
    return jokes;
  }
})

function App() {
  const { data:session } = authClient.useSession();
  const jokes = Route.useLoaderData();
  const handleDelete = async(jokeId : jokeIdtype) => {
    console.log(jokeId);
    try {
      await deleteJoke({
          data: jokeId,
      });
      } catch (err) {
      alert(String(err));
      }

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
          <Link to='/addjoke' className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]">
            Add Joke
          </Link>
        </div>
        ) }
        
      </section>
      
      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Joke Bin</p>
        { jokes.length==0 ? 
        (
        <><span>No joke found</span></>
        ) 
        : 
        <ul className="m-0 list-none space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          { jokes.map((j)=>(
            <li className="island-shell mt-8 rounded-2xl p-6" key={j.joke.id}>
              {j.joke.content}<br/>cracked by:{j.user?.name}
              {session && 
                ( j.user.id==session.user.id && (
                  <><br/><span onClick={()=>handleDelete(j.joke.id)}>Delete</span></>
                ) 
              )}
            </li>
            )) 
          }
        </ul>
        }
          
      </section>

    </main>
  )
}
