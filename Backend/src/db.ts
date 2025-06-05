import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root", // Thay bằng user MySQL của bạn
  password: "", // Thay bằng password MySQL của bạn
  database: "university", // Tên database
});
