import { joke } from '#/db/schema';
import { getSession } from '#/lib/auth.functions';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, type ReactEventHandler } from 'react'
import { createJoke } from '#/server/joke';

type NewJoke = typeof joke.$inferInsert;

export const Route = createFileRoute('/addjoke')({
  /* Protectting the addjoke route from unauthorized logged in users */
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/signin" });
    }

    return { currentUser: session.user };
  },
  loader: async ({ context }) => {
    // Access 'currentUser' from the context passed from beforeLoad
    const { currentUser } = context; 
    // Fetch data using the user info
    //const data = await fetchSomeData(currentUser.id);
    return {
      currentUserData: currentUser,
    };
  },
  component: RouteComponent,
})

function RouteComponent() {
    // Access the data returned by the loader
  const { currentUserData } = Route.useLoaderData();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>("");
    const handleSubmit: ReactEventHandler<HTMLFormElement> = async(e) => {
        e.preventDefault();
        const newJoke: NewJoke = { 
          content: content, 
          userId: currentUserData.id,
        };
        try {
        await createJoke({
           data: newJoke,
        });
        setContent("");
        navigate({to:"/"});
        } catch (err) {
        alert(String(err));
        }
    }
  return (
      <main className="page-wrap px-4 py-12">
        <section className="island-shell rounded-2xl p-6 sm:p-8">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
         
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className="display-title text-center mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-3xl">
                Add a Joke!
              </h1> 
              <span>{}</span> 
            </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium">Enter your joke:</label>
                <div className="mt-2">
                  <input 
                  type="text" 
                  id="content" 
                  name="content" 
                  required 
                  value={content}
                  onChange={(e)=>setContent(e.target.value)}
                  className="w-full rounded-md px-3 py-1.5 border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm sm:text-sm/6 font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]" 
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save Joke
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    )
}