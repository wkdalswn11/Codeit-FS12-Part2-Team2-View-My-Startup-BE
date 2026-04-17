import { addComparesService } from "../services/compare.service.js";

export const addComparesController = async (req, res) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const compares = await addComparesService;
    res.status(201).json({ message: compares.message });
  } catch (error) {}
};
export const getComparesController = async (req, res) => {
  try {
  } catch (error) {}
};
export const deleteCompareController = async (req, res) => {
  try {
  } catch (error) {}
};
