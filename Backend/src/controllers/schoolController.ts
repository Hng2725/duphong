import { Request, Response } from "express";
import { db } from "../db";

export const saveSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { schoolName } = req.body;

  if (!schoolName) {
    res.status(400).json({ message: "Tên trường không được để trống" });
    return;
  }

  try {
    await db.query("INSERT INTO schools (name) VALUES (?)", [schoolName]);

    // Truy vấn danh sách các trường sau khi thêm
    const [schools] = await db.query("SELECT * FROM schools");

    res.status(201).json({ message: "Đã lưu tên trường thành công", schools });
  } catch (err) {
    console.error("Lỗi khi lưu tên trường:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};