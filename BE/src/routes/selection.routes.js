import express from "express";
import { resetSelectionsController } from "../controllers/selection.controller.js";

const router = express.Router({ mergeParams: true });

router.delete("/", resetSelectionsController);

export default router;
