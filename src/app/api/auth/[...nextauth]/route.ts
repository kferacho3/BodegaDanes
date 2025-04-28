import NextAuth, {
    type DefaultSession,
    type NextAuthOptions,
} from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
  
  /* ---------- module augmentation ---------- */
  declare module 'next-auth' {
    interface Session extends DefaultSession {
      user: DefaultSession['user'] & { role: 'ADMIN' }
    }
  }
  declare module 'next-auth/jwt' {
    interface JWT { role?: 'ADMIN' }
  }
  
  export const authOptions: NextAuthOptions = {
    providers: [
      Credentials({
        name: 'Admin Login',
        credentials: {
          email   : { label: 'Email',    type: 'email'    },
          password: { label: 'Password', type: 'password' },
          key     : { label: 'Passkey',  type: 'text'     },
        },
        async authorize(c) {
          if (!c?.email || !c.password || !c.key) return null
  
          const ok =
            c.email.toLowerCase() === (process.env.ADMIN_EMAIL ?? '').toLowerCase() &&
            c.password            === (process.env.ADMIN_PASSWORD ?? '') &&
            c.key                 === (process.env.ADMIN_PASSKEY  ?? '')
  
          return ok
            ? { id: 'admin', name: 'Site Owner', email: c.email, role: 'ADMIN' }
            : null
        },
      }),
    ],
  
    /* 30-minute JWT session */
    session: { strategy: 'jwt', maxAge: 60 * 30 },
  
    callbacks: {
      async jwt({ token, user }) {
        if (user && 'role' in user) token.role = (user as { role: 'ADMIN' }).role
        return token
      },
      async session({ session, token }) {
        if (token.role) (session.user as { role: 'ADMIN' }).role = token.role
        return session
      },
    },
  
    pages : { signIn: '/auth/signin' },
    secret: process.env.NEXTAUTH_SECRET,
  }
  
  const handler = NextAuth(authOptions)
  export { handler as GET, handler as POST }
  