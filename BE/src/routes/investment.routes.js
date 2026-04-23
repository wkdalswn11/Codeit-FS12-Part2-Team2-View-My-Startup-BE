import express from "express";
import {
  addFavoriteInvestmentController,
  deleteInvestmentController,
  updateInvestmentController,
} from "../controllers/investment.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", addFavoriteInvestmentController);
router.get("/:companyId", getInvestment);
router.patch("/:investmentId", updateInvestmentController);
router.delete("/:investmentId", deleteInvestmentController);

export default router;
