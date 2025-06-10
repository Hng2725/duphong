import { Request, Response } from "express";
import { db } from "../db";

// Lấy danh sách tổ hợp
export const getCombinations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Truy vấn các cột cần thiết từ bảng combinations
    const [combinations] = await db.query(
      "SELECT id, code, subject1, subject2, subject3, description FROM combinations"
    );

    res.json(combinations); // Trả về dữ liệu trực tiếp
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tổ hợp:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Thêm tổ hợp mới
export const saveCombination = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, subject1, subject2, subject3, description } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!code || !subject1 || !subject2 || !subject3 || !description) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    return;
  }

  try {
    // Thêm tổ hợp vào cơ sở dữ liệu
    await db.query(
      "INSERT INTO combinations (code, subject1, subject2, subject3, description) VALUES (?, ?, ?, ?, ?)",
      [code, subject1, subject2, subject3, description]
    );

    const [combinations] = await db.query("SELECT * FROM combinations");
    res.status(201).json({ message: "Đã thêm tổ hợp thành công", combinations });
  } catch (err) {
    console.error("Lỗi khi thêm tổ hợp:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Sửa tổ hợp
export const updateCombination = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const { code, subjects, description } = req.body;

  if (!code || !subjects || !description) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    return;
  }

  try {
    const [result] = await db.query(
      "UPDATE combinations SET code = ?, subjects = ?, description = ? WHERE id = ?",
      [code, JSON.stringify(subjects), description, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy tổ hợp để sửa" });
      return;
    }

    const [combinations] = await db.query("SELECT * FROM combinations");
    res.json({ message: "Đã sửa tổ hợp thành công", combinations });
  } catch (err) {
    console.error("Lỗi khi sửa tổ hợp:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Xóa tổ hợp
export const deleteCombination = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM combinations WHERE id = ?", [
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy tổ hợp để xóa" });
      return;
    }

    const [combinations] = await db.query("SELECT * FROM combinations");
    res.json({ message: "Đã xóa tổ hợp thành công", combinations });
  } catch (err) {
    console.error("Lỗi khi xóa tổ hợp:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
