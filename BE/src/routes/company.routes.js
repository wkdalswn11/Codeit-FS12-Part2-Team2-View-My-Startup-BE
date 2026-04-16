import express from "express";
import {
  getCompaniesController,
  getCompanyByIdController,
} from "../controllers/company.controller.js";

const router = express.Router();
router.get("/", getCompaniesController);
router.get("/:companyId", getCompanyByIdController);

export default router;
