/*  src/app/api/auth/[...nextauth]/route.ts
    — Single-provider admin login using Credentials
------------------------------------------------------------------- */
import NextAuth, {
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/* ---------- module augmentation ---------- */
declare module 'next-auth' {
  interface User { id: string }               // ← expose custom id
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & { id: string; role: 'ADMIN' };
  }
}
declare module 'next-auth/jwt' {
  interface JWT { id?: string; role?: 'ADMIN' }
}

/* ---------- options ---------- */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Admin Login',
      credentials: {
        email   : { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
        key     : { label: 'Passkey',  type: 'text' },
      },
      async authorize(c) {
        if (!c?.email || !c.password || !c.key) return null;

        const ok =
          c.email.toLowerCase() === (process.env.ADMIN_EMAIL     ?? '').toLowerCase() &&
          c.password            === (process.env.ADMIN_PASSWORD  ?? '')               &&
          c.key                 === (process.env.ADMIN_PASSKEY   ?? '');

        return ok
          ? { id: 'admin', name: 'Site Owner', email: c.email, role: 'ADMIN' }
          : null;
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 60 * 30 },        // 30-min JWT

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = (user as { id: string }).id;
        token.role = (user as { role: 'ADMIN' }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id)   session.user.id   = token.id as string;
      if (token.role) session.user.role = token.role as 'ADMIN';
      return session;
    },
  },

  pages : { signIn: '/auth/signin' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
