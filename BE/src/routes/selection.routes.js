import express from "express";
import {
  getMyCompanyRankingController,
  getSelectionsController,
  resetSelectionsController,
} from "../controllers/selection.controller.js";

const router = express.Router({ mergeParams: true });

router.delete("/", resetSelectionsController);
router.get("/", getSelectionsController);
router.get("/ranking", getMyCompanyRankingController);

export default router;
