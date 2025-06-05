import { Request, Response } from "express";

// Giả lập dữ liệu
let admin = { username: "admin", password: "admin123" };
let profiles = [
  { id: 1, userId: 1, universityId: 1, majorId: 1, status: "Đã nộp" },
];

// Đăng nhập admin
export const adminLogin = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) {
    res.json({ message: "Admin đăng nhập thành công" });
    return;
  }
  res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu admin" });
};

// Lấy tất cả hồ sơ đã nộp (admin)
export const getAllProfiles = (req: Request, res: Response): void => {
  res.json(profiles);
};