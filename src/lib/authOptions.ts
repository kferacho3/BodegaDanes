// src/lib/authOptions.ts
import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User { id: string; role: 'ADMIN' | 'USER' }
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & { id: string; role: 'ADMIN' | 'USER' }
  }
}
declare module 'next-auth/jwt' {
  interface JWT { id?: string; role?: 'ADMIN' | 'USER' }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Admin Login',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        key:      { label: 'Passkey',  type: 'text'     },
      },
      async authorize(c) {
        if (!c?.email || !c.password || !c.key) return null
        const ok =
          c.email.toLowerCase() === (process.env.ADMIN_EMAIL ?? '').toLowerCase() &&
          c.password            === (process.env.ADMIN_PASSWORD ?? '') &&
          c.key                 === (process.env.ADMIN_PASSKEY ?? '')
        return ok ? { id: 'admin', name: 'Site Owner', email: c.email, role: 'ADMIN' } : null
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 60 * 30 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id   = token.id!
      session.user.role = token.role!
      return session
    },
  },
  pages: { signIn: '/auth/signin' },
  secret: process.env.NEXTAUTH_SECRET,
}
