import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const sqlFilePath = path.resolve("./medical_reports.sql");

async function runImport() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: false,
    },
    multipleStatements: true,
  });

  const sql = fs.readFileSync(sqlFilePath, "utf8");

  console.log("Starting SQL import...");
  await connection.query(sql);
  console.log("SQL import completed");

  await connection.end();
}

runImport().catch(console.error);
