import { authClient } from '#/lib/auth-client';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState<string | undefined>("");
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async(e) => {
    e.preventDefault();
    const res = await authClient.signUp.email({email, name, password});
    if(res.error){
      const er = res.error.message;
      setSignupError(er);
    }else{
      navigate({to:"/"});
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
                Register Here
              </h1>
              <span>{signupError}</span>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm/6 font-medium">Name</label>
                  <div className="mt-2">
                    <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    onChange={(e)=>setName(e.target.value)}
                    className="w-full rounded-md px-3 py-1.5 border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm sm:text-sm/6 font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]" 
                    />
                  </div>
                </div>
    
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
                  <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
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
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Sign up
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm/6 text-gray-400">
                Already a member?{' '}
                <Link to="/signin" className="font-semibold text-indigo-400 hover:text-indigo-300">
                SignIn Here!!
                </Link>
              </p>
            </div>
            </div>
          </section>
        </main>
  )
}
