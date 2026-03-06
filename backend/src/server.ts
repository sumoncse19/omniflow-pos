import app from "./app";
import { pool } from "./config/db";

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("shutting down...");
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
