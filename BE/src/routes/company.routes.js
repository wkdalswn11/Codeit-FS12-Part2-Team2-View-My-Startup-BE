import express from "express";
import {
  addCompanyInvestmentController,
  getCompaniesController,
  getCompanyByIdController,
  getCompanyInvestmentsController,
} from "../controllers/company.controller.js";

const router = express.Router();
router.get("/trending")
router.get("/", getCompaniesController);
router.get("/:companyId/investments", getCompanyInvestmentsController);
router.post("/:companyId/investments", addCompanyInvestmentController);
router.get("/:companyId", getCompanyByIdController);

export default router;
