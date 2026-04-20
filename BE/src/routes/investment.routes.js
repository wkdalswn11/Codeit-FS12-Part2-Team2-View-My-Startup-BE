import express from "express";
import { investmentController } from "../controllers/investment.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", investmentController);

export default router;
