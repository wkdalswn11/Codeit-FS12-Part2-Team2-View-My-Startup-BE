import express from "express";
import {
  addComparesController,
  getComparesController,
  deleteCompareController,
} from "../controllers/compare.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", addComparesController);
router.get("/", getComparesController);
router.delete("/:companyId", deleteCompareController);

export default router;
