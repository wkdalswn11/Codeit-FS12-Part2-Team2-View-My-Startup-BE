import {
  addComparesService,
  deleteCompareService,
  getComparesService,
} from "../services/compare.service.js";

export const addComparesController = async (req, res) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const compares = await addComparesService(userId, companyId);
    res.status(201).json({ message: compares.message });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const getComparesController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const compares = await getComparesService(userId);
    res.status(200).json({ data: compares.data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const deleteCompareController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const companyId = Number(req.params.companyId);
    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    await deleteCompareService(userId, companyId);
    res.status(200).json({ message: "비교기업이 선택 해제 되었습니다." });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
