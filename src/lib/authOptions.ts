import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/* ── module augmentation ─────────────────────────────────────────── */
declare module 'next-auth' {
  interface User {
    id: string;
    role: 'ADMIN' | 'USER';
  }
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      role: 'ADMIN' | 'USER';
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'ADMIN' | 'USER';
  }
}

/* ── pick up NEXTAUTH_SECRET from either build- or run-time ───────── */
const runtimeSecret: string | undefined =
  process.env.NEXTAUTH_SECRET ??
  (() => {
    try {
      const blob = process.env.secrets ? JSON.parse(process.env.secrets) : {};
      return typeof blob.NEXTAUTH_SECRET === 'string'
        ? blob.NEXTAUTH_SECRET
        : undefined;
    } catch {
      return undefined;
    }
  })();

/* ── NextAuth configuration ───────────────────────────────────────── */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Admin Login',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        key:      { label: 'Passkey',  type: 'text'     },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password || !creds.key) return null;
        const isAdmin =
          creds.email.toLowerCase()   === (process.env.ADMIN_EMAIL   ?? '').toLowerCase() &&
          creds.password              === (process.env.ADMIN_PASSWORD?? '')               &&
          creds.key                   === (process.env.ADMIN_PASSKEY ?? '');
        return isAdmin
          ? { id: 'admin', name: 'Site Owner', email: creds.email, role: 'ADMIN' }
          : null;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   60 * 30, // 30 minutes
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id   = token.id!;
      session.user.role = token.role!;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  // must have a secret in production
  secret: runtimeSecret,
};
