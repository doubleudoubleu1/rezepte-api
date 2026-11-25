import "dotenv/config";
import { getPostgresPool } from "../src/pool.postgres.ts";

// Smoke-Test: simpelste mögliche Query — kommt eine Zeit zurück, steht die Verbindung.
const pool = getPostgresPool();
const res = await pool.query("SELECT NOW()");
console.log("DB sagt:", res.rows[0]);       // { now: 2026-11-... }
await pool.end();
