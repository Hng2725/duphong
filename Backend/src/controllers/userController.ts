import { Request, Response } from "express";
import { db } from "../db";

// Đăng ký
export const register = async (req: Request, res: Response): Promise<void> => {
  console.log("Register API được gọi với:", req.body); // Log dữ liệu nhận được
  const { username, password } = req.body;

  if (!username || !password || username.length < 4 || password.length < 6) {
    res.status(400).json({ message: "Username và password không hợp lệ" });
    return;
  }

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [
      username,
    ]);
    if ((rows as any[]).length > 0) {
      res.status(400).json({ message: "Username đã tồn tại" });
      return;
    }

    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    console.log("Đã thêm user vào database:", username);
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("Login API được gọi với:", req.body); // Log dữ liệu nhận được
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if ((rows as any[]).length === 0) {
      res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
      return;
    }

    res.json({
      message: "Đăng nhập thành công",
      userId: (rows as any[])[0].id,
    });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
