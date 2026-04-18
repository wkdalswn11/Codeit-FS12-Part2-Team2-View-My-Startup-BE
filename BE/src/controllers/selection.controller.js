import {
  getMyCompanyRankingService,
  getSelectionsService,
  resetSelectionsService,
} from "../services/selection.service.js";

export const resetSelectionsController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    await resetSelectionsService(userId);
    res.status(200).json({ message: "선택이 초기화되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const getSelectionsController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }

    if (req.query.sort && !companySortOrder[req.query.sort]) {
      return res.status(400).json({ error: "유효하지 않은 정렬 기준입니다." });
    }

    const selections = await getSelectionsService(userId, req.query);
    res.status(200).json({ data: selections.data });
  } catch (error) {
    next(error);
  }
};

export const getMyCompanyRankingController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const myCompanyRanking = await getMyCompanyRankingService(
      userId,
      req.query,
    );
    res.status(200).json({ data: myCompanyRanking.data });
  } catch (error) {
    next(error);
  }
};
