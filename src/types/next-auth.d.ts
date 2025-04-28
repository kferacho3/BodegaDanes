import 'next-auth'

declare module 'next-auth' {
  interface User  { role: 'ADMIN' | 'USER' }
  interface Token { role?: 'ADMIN' | 'USER' }
  interface Session {
    user: {
      id?: string
      email?: string
      role: 'ADMIN' | 'USER'
      name?: string | null
    }
  }
}
