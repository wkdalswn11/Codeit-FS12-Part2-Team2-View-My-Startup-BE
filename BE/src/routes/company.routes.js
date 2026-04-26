import express from "express";
import {
  addCompanyInvestmentController,
  getCompaniesController,
  getCompanyByIdController,
  getCompanyInvestmentsController,
  getTrendingController,
} from "../controllers/company.controller.js";

const router = express.Router();
router.get("/trending", getTrendingController);
router.get("/", getCompaniesController);
router.get("/:companyId/investments", getCompanyInvestmentsController);
router.post("/:companyId/investments", addCompanyInvestmentController);
router.get("/:companyId", getCompanyByIdController);

export default router;
