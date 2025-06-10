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

// Sửa tên trường
export const updateSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id); // ID trường từ URL params
  const { schoolName } = req.body; // Tên trường mới từ body

  if (!schoolName) {
    res.status(400).json({ message: "Tên trường không được để trống" });
    return;
  }

  try {
    const [result] = await db.query(
      "UPDATE schools SET name = ? WHERE id = ?",
      [schoolName, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy trường để sửa" });
      return;
    }

    // Truy vấn danh sách các trường sau khi sửa
    const [schools] = await db.query("SELECT * FROM schools");
    res.json({ message: "Đã sửa tên trường thành công", schools });
  } catch (err) {
    console.error("Lỗi khi sửa tên trường:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

export const deleteSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id); // ID trường từ URL params

  try {
    // Xóa tất cả các ngành liên kết với trường
    await db.query("DELETE FROM majors WHERE school_id = ?", [id]);

    // Xóa trường
    const [result] = await db.query("DELETE FROM schools WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy trường để xóa" });
      return;
    }

    // Truy vấn danh sách các trường sau khi xóa
    const [schools] = await db.query("SELECT * FROM schools");
    res.json({ message: "Đã xóa trường thành công", schools });
  } catch (err) {
    console.error("Lỗi khi xóa trường:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
