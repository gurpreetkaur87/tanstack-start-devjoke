import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState, type ReactEventHandler } from 'react';
import { authClient } from '#/lib/auth-client';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState<string | undefined>("");
  const handleSignin:ReactEventHandler<HTMLFormElement> = async(e) => {
    e.preventDefault();
    const res = await authClient.signIn.email({
      email: email,
      password: password,
      callbackURL: "/" // Optional redirect
    });
    if(res.error){
      const err = res.error.message;
      setSignInError(err);
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
              Sign In!
            </h1> 
            <span>{signInError}</span> 
          </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium">Email</label>
              <div className="mt-2">
                <input 
                type="text" 
                id="email" 
                name="email" 
                required 
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full rounded-md px-3 py-1.5 border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm sm:text-sm/6 font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
              </div>
              <div className="mt-2">
                <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded-md px-3 py-1.5 border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm sm:text-sm/6 font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]" 
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Start a 14 day free trial
            </Link>
          </p>
        </div>
      </div>
    </section>
  </main>
  )
}
