import express from "express";
import {
  addFavoriteController,
  getFavoritesController,
} from "../controllers/favorite.controller.js";

const router = express.Router();
router.post("/", addFavoriteController);
router.get("/", getFavoritesController);

export default router;
