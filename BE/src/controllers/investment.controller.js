import { investmentService } from "../services/investment.service.js";

export const investmentController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const investment = await investmentService(userId, req.body);
    res.status(201).json({ message: investment.message });
  } catch (error) {
    next(error);
  }
};
