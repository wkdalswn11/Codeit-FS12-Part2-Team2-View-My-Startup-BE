import {
  addFavoriteInvestmentService,
  deleteInvestmentService,
  updateInvestmentService,
} from "../services/investment.service.js";

export const addFavoriteInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const investment = await addFavoriteInvestmentService(userId, req.body);
    res.status(201).json({ message: investment.message });
  } catch (error) {
    next(error);
  }
};

export const updateInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const investmentId = Number(req.params.investmentId);
    if (Number.isNaN(investmentId)) {
      return res.status(400).json({ error: "유효한 투자 내역이 아닙니다." });
    }
    const updateInvestment = await updateInvestmentService(
      userId,
      investmentId,
      req.body,
    );
    res.status(200).json({ message: updateInvestment.message });
  } catch (error) {
    next(error);
  }
};

export const deleteInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const investmentId = Number(req.params.investmentId);
    if (Number.isNaN(investmentId)) {
      return res.status(400).json({ error: "유효한 투자 내역이 아닙니다." });
    }
    const deleteInvestment = await deleteInvestmentService(
      userId,
      investmentId,
    );
    res.status(200).json({ message: deleteInvestment.message });
  } catch (error) {
    next(error);
  }
};
