import express from "express";
import { getCompaniesController } from "../controllers/company.controller.js";

const router = express.Router();
router.get("/", getCompaniesController);

export default router;
