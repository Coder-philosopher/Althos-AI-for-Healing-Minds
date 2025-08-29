import fs from "fs";
import { Client } from "pg";

async function main() {
  console.log("🚀 Starting DB update...");

  // Read schema.sql
  let sql;
  try {
    sql = fs.readFileSync("schema.sql", "utf8");
    console.log("📂 Loaded schema.sql successfully.");
  } catch (err) {
    console.error("❌ Failed to read schema.sql:", err.message);
    process.exit(1);
  }

  const client = new Client({
    connectionString:
      "postgresql://neondb_owner:npg_YnlEhszkp70T@ep-cold-bush-aduvix0u-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  });

  try {
    console.log("🔌 Connecting to Neon...");
    await client.connect();
    console.log("✅ Connected.");

    console.log("⚡ Running schema.sql...");
    await client.query(sql);
    console.log("✅ Database updated successfully!");
  } catch (err) {
    console.error("❌ Error executing SQL:", err.message);
    console.error(err);
  } finally {
    console.log("🔌 Closing connection...");
    await client.end();
    console.log("👋 Done.");
  }
}

main();
