import {
  addFavoriteInvestmentService,
  deleteInvestmentService,
  getInvestmentService,
  updateInvestmentService,
} from "../services/investment.service.js";

export const addFavoriteInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const investment = await addFavoriteInvestmentService(userId, req.body);
    res.status(201).json({ message: investment.message });
  } catch (error) {
    next(error);
  }
};

export const getInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const investment = await getInvestmentService(userId, companyId);
    res.status(200).json({ data: investment });
  } catch (error) {
    next(error);
  }
};

export const updateInvestmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const investmentId = Number(req.params.investmentId);

    if (Number.isNaN(investmentId)) {
      const error = new Error("유효한 투자 내역이 아닙니다.");
      error.status = 400;
      throw error;
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
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const investmentId = Number(req.params.investmentId);

    if (Number.isNaN(investmentId)) {
      const error = new Error("유효한 투자 내역이 아닙니다.");
      error.status = 400;
      throw error;
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
