import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Database Config
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
})


export default db.promise();