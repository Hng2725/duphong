import { Request, Response } from "express";

// Giả lập dữ liệu
let combinations = [{ id: 1, name: "A00" }];

// CRUD tổ hợp xét tuyển
export const getCombinations = (req: Request, res: Response): void => {
  res.json(combinations);
};

export const addCombination = (req: Request, res: Response): void => {
  const { name } = req.body;
  const newComb = { id: combinations.length + 1, name };
  combinations.push(newComb);
  res.status(201).json(newComb);
};

export const updateCombination = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const comb = combinations.find((c) => c.id === id);
  if (!comb) {
    res.status(404).json({ message: "Không tìm thấy tổ hợp" });
    return;
  }
  comb.name = name;
  res.json(comb);
};

export const deleteCombination = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  combinations = combinations.filter((c) => c.id !== id);
  res.json({ message: "Đã xóa tổ hợp" });
};