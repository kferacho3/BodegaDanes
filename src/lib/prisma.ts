// src/lib/prisma.ts
import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  // prevent creating new clients on every hot-reload
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma =
  global.__prisma ?? new PrismaClient({ log: ['error', 'warn'] })

if (process.env.NODE_ENV !== 'production') global.__prisma = prisma

// re-export the generated types so other files can `import type { Prisma }`
export type { Prisma }
