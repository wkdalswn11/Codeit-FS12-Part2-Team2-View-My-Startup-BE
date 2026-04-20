import express from "express";
import {
  addUserController,
  loginUserControl,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", addUserController);
router.post("/login", loginUserControl);

export default router;
