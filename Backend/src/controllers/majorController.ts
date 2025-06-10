import { Request, Response } from "express";
import { db } from "../db"; // Import kết nối cơ sở dữ liệu

// Lấy danh sách ngành
export const getMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    const [majors] = await db.query("SELECT * FROM majors");
    res.json(majors);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách ngành:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Thêm ngành mới
export const addMajor = async (req: Request, res: Response): Promise<void> => {
  const { name, schoolId } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !schoolId) {
    res
      .status(400)
      .json({ message: "Tên ngành và ID trường không được để trống" });
    return;
  }

  try {
    // Thêm ngành mới vào bảng majors
    const [result] = await db.query(
      "INSERT INTO majors (name, school_id) VALUES (?, ?)",
      [name, schoolId]
    );

    // Kiểm tra nếu thêm thành công
    if ((result as any).affectedRows === 0) {
      res
        .status(500)
        .json({ message: "Không thể thêm ngành vào cơ sở dữ liệu" });
      return;
    }

    // Truy vấn danh sách ngành sau khi thêm
    const [majors] = await db.query("SELECT * FROM majors");
    res.status(201).json({ message: "Đã thêm ngành thành công", majors });
  } catch (err) {
    console.error("Lỗi khi thêm ngành:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Cập nhật ngành
export const updateMajor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { name, schoolId } = req.body;

  if (!name) {
    res.status(400).json({ message: "Tên ngành không được để trống" });
    return;
  }

  try {
    const [result] = await db.query("UPDATE majors SET name = ? WHERE id = ?", [
      name,
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy ngành" });
      return;
    }

    // Truy vấn danh sách ngành sau khi cập nhật
    const [majors] = await db.query(
      "SELECT * FROM majors WHERE school_id = ?",
      [schoolId]
    );
    res.json({ message: "Đã cập nhật ngành thành công", majors });
  } catch (err) {
    console.error("Lỗi khi cập nhật ngành:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};

// Xóa ngành
export const deleteMajor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { schoolId } = req.body;

  try {
    const [result] = await db.query("DELETE FROM majors WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy ngành để xóa" });
      return;
    }

    // Truy vấn danh sách ngành sau khi xóa
    const [majors] = await db.query("SELECT * FROM majors WHERE school_id = ?", [schoolId]);
    res.json({ message: "Đã xóa ngành thành công", majors });
  } catch (err) {
    console.error("Lỗi khi xóa ngành:", err);
    res.status(500).json({ message: "Lỗi server", error: err });
  }
};
