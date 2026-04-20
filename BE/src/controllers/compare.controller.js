import {
  addComparesService,
  deleteCompareService,
  getComparesService,
} from "../services/compare.service.js";

export const addComparesController = async (req, res, next) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const compares = await addComparesService(userId, companyId);
    res.status(201).json({ message: compares.message });
  } catch (error) {
    next(error);
  }
};

export const getComparesController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const compares = await getComparesService(userId);
    res.status(200).json({ data: compares.data });
  } catch (error) {
    next(error);
  }
};

export const deleteCompareController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    await deleteCompareService(userId, companyId);
    res.status(200).json({ message: "비교기업이 선택 해제 되었습니다." });
  } catch (error) {
    next(error);
  }
};
