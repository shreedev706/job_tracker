import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the native PostgreSQL connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Bind the pool to the Prisma 7 driver adapter
const adapter = new PrismaPg(pool);

// Instantiate Prisma using the type-safe adapter option
const prisma = new PrismaClient({ adapter });

export default prisma;