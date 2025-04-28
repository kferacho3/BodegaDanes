'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function SignIn() {
  const { data: session } = useSession()

  /* ---------------- state ---------------- */
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [key,      setKey]      = useState('')
  const [error,    setError]    = useState('')

  /* ---------------- redirect if already authed ---------------- */
  if (session?.user.role === 'ADMIN') {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-charcoal via-black to-charcoal p-6">
        <Link
          href="/admin"
          className="rounded-full bg-white/10 px-8 py-3 font-custom text-xl tracking-wide text-silver-light transition hover:bg-white/20"
        >
          Go&nbsp;to&nbsp;Admin&nbsp;Dashboard
        </Link>
      </main>
    )
  }

  /* ---------------- form ---------------- */
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-charcoal via-black to-charcoal p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await signIn('credentials', {
            email,
            password,
            key,
            redirect   : false,
            callbackUrl: '/admin',
          })
          if (res?.error) setError('Invalid credentials')
          if (res?.ok)    window.location.href = res.url ?? '/admin'
        }}
        className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-10 shadow-xl backdrop-blur-md transition"
      >
        <header className="space-y-1 text-center">
          <h1 className="font-custom text-3xl tracking-wide text-silver-light">
            Admin&nbsp;Login
          </h1>
          <p className="text-sm text-silver-dark/70">
            Only authorised staff may continue
          </p>
        </header>

        {/* ------------- inputs ------------- */}
        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(v) => setEmail(v)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(v) => setPassword(v)}
        />

        <Input
          placeholder="Passkey"
          value={key}
          onChange={(v) => setKey(v)}
        />

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        {/* ------------- submit ------------- */}
        <button
          className="w-full rounded-full bg-chalk-red py-3 font-semibold tracking-wide text-white transition hover:bg-chalk-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chalk-red"
        >
          Sign&nbsp;In
        </button>
      </form>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  Re-usable controlled input with consistent styling                */
/* ------------------------------------------------------------------ */
type InputProps = {
  type?: 'text' | 'password' | 'email'
  placeholder: string
  value: string
  onChange: (v: string) => void
}

function Input({ type = 'text', placeholder, value, onChange }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 font-custom text-silver-light placeholder:text-silver-light/60 focus:border-chalk-red focus:outline-none focus:ring-2 focus:ring-chalk-red transition"
      required
    />
  )
}
