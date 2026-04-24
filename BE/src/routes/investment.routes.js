import express from "express";
import {
  addFavoriteInvestmentController,
  deleteInvestmentController,
  getInvestmentController,
  updateInvestmentController,
} from "../controllers/investment.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", addFavoriteInvestmentController);
router.get("/:companyId", getInvestmentController);
router.patch("/:companyId", updateInvestmentController);
router.delete("/:companyId", deleteInvestmentController);

export default router;
