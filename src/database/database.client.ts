import { Client } from 'pg';

export async function testDatabaseConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const result = await client.query('SELECT NOW()');

  console.log('Database connected:', result.rows[0]);

  await client.end();
}