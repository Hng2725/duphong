import { Request, Response } from "express";

// Giả lập dữ liệu
let universities = [{ id: 1, name: "ĐH A", majors: [1], combinations: [1] }];

// CRUD trường đại học
export const getUniversities = (req: Request, res: Response): void => {
  res.json(universities);
};

export const addUniversity = (req: Request, res: Response): void => {
  const { name } = req.body;
  const newUni = {
    id: universities.length + 1,
    name,
    majors: [],
    combinations: [],
  };
  universities.push(newUni);
  res.status(201).json(newUni);
};

export const updateUniversity = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const uni = universities.find((u) => u.id === id);
  if (!uni) {
    res.status(404).json({ message: "Không tìm thấy trường" });
    return;
  }
  uni.name = name;
  res.json(uni);
};

export const deleteUniversity = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  universities = universities.filter((u) => u.id !== id);
  res.json({ message: "Đã xóa trường" });
};