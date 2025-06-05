import { Request, Response } from "express";

// Giả lập dữ liệu
let majors = [{ id: 1, name: "Công nghệ thông tin" }];

// CRUD ngành
export const getMajors = (req: Request, res: Response): void => {
  res.json(majors);
};

export const addMajor = (req: Request, res: Response): void => {
  const { name } = req.body;
  const newMajor = { id: majors.length + 1, name };
  majors.push(newMajor);
  res.status(201).json(newMajor);
};

export const updateMajor = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const major = majors.find((m) => m.id === id);
  if (!major) {
    res.status(404).json({ message: "Không tìm thấy ngành" });
    return;
  }
  major.name = name;
  res.json(major);
};

export const deleteMajor = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  majors = majors.filter((m) => m.id !== id);
  res.json({ message: "Đã xóa ngành" });
};