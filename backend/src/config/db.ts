import { Pool } from "pg";

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "omniflow_pos",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      max: 20,
    });

export { pool };

pool.on("error", (err) => {
  console.error("db pool error", err);
  process.exit(-1);
});
