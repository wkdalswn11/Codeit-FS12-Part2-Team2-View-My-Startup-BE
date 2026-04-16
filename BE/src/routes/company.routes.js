import express from "express";
import {
  getCompaniesController,
  getCompanyByIdController,
  getCompanyInvestmentsController,
} from "../controllers/company.controller.js";

const router = express.Router();
router.get("/", getCompaniesController);
router.get("/:companyId", getCompanyByIdController);
router.get("/:companyId/investments", getCompanyInvestmentsController);

export default router;
