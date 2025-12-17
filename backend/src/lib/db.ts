
import { PrismaClient } from '../generated/prisma/index'
 export let prisma = new PrismaClient();

// // declare global {
// //   // For Next.js / hot reload in dev
// //   // Ensures we don't create multiple Prisma clients
// //   var prisma: PrismaClient | undefined;
// // }

// if (!global.prisma) {
//   global.prisma = new PrismaClient();
// }

// prisma = global.prisma;


